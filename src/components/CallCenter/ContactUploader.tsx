import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Contact {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  notes?: string;
}

interface ContactUploaderProps {
  campaignId?: string;
  onSuccess?: (contacts: Contact[]) => void;
}

const ContactUploader: React.FC<ContactUploaderProps> = ({ campaignId, onSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedContacts, setUploadedContacts] = useState<Contact[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    // Check file type
    if (file.type !== 'text/csv') {
      toast.error('Please upload a CSV file');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setErrors([]);
    
    try {
      // Read the file
      const text = await readFileAsync(file);
      const contacts = parseCSV(text);
      
      if (contacts.length === 0) {
        throw new Error('No contacts found in the CSV file');
      }
      
      // Validate contacts
      const validatedContacts = validateContacts(contacts);
      
      // Insert contacts into database if campaign ID is provided
      if (campaignId) {
        await saveContactsToDatabase(validatedContacts, campaignId);
      }
      
      setUploadedContacts(validatedContacts);
      
      if (onSuccess) {
        onSuccess(validatedContacts);
      }
      
      toast.success(`Successfully processed ${validatedContacts.length} contacts`);
    } catch (error) {
      toast.error('Failed to process contacts file');
      console.error('Error processing contacts:', error);
      setErrors([error.message]);
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
      // Reset file input
      e.target.value = '';
    }
  };
  
  const readFileAsync = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        resolve(reader.result as string);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 50); // 50% for reading
          setUploadProgress(progress);
        }
      };
      
      reader.readAsText(file);
    });
  };
  
  const parseCSV = (text: string): Contact[] => {
    const lines = text.split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must have a header row and at least one contact');
    }
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const nameIndex = headers.indexOf('name');
    const phoneIndex = headers.indexOf('phone');
    
    if (nameIndex === -1 || phoneIndex === -1) {
      throw new Error('CSV file must have "name" and "phone" columns');
    }
    
    const emailIndex = headers.indexOf('email');
    const companyIndex = headers.indexOf('company');
    const notesIndex = headers.indexOf('notes');
    
    const contacts: Contact[] = [];
    const localErrors: string[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim());
      
      if (values.length < headers.length) {
        localErrors.push(`Line ${i+1}: Not enough values`);
        continue;
      }
      
      const contact: Contact = {
        name: values[nameIndex],
        phone: values[phoneIndex]
      };
      
      if (emailIndex !== -1) contact.email = values[emailIndex];
      if (companyIndex !== -1) contact.company = values[companyIndex];
      if (notesIndex !== -1) contact.notes = values[notesIndex];
      
      contacts.push(contact);
    }
    
    if (localErrors.length > 0) {
      setErrors(localErrors);
    }
    
    return contacts;
  };
  
  const validateContacts = (contacts: Contact[]): Contact[] => {
    const validContacts: Contact[] = [];
    const localErrors: string[] = [];
    
    contacts.forEach((contact, index) => {
      if (!contact.name) {
        localErrors.push(`Contact ${index+1}: Name is required`);
        return;
      }
      
      // Basic phone number validation
      if (!contact.phone || !/^[\d\+\-\(\) ]{7,20}$/.test(contact.phone)) {
        localErrors.push(`Contact ${index+1}: Invalid phone number`);
        return;
      }
      
      // Basic email validation if provided
      if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
        localErrors.push(`Contact ${index+1}: Invalid email`);
        return;
      }
      
      validContacts.push(contact);
    });
    
    if (localErrors.length > 0) {
      setErrors(prev => [...prev, ...localErrors]);
    }
    
    return validContacts;
  };
  
  const saveContactsToDatabase = async (contacts: Contact[], campaignId: string) => {
    try {
      // Save contacts in batches of 50
      const batchSize = 50;
      const batches = [];
      
      for (let i = 0; i < contacts.length; i += batchSize) {
        batches.push(contacts.slice(i, i + batchSize));
      }
      
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const { error } = await supabase
          .from('contacts')
          .insert(
            batch.map(contact => ({
              name: contact.name,
              phone: contact.phone,
              email: contact.email || null,
              custom_fields: contact.company || contact.notes ? {
                company: contact.company,
                notes: contact.notes
              } : {},
              campaign_id: campaignId
            }))
          );
        
        if (error) {
          throw error;
        }
        
        // Update progress for processing (50% to 100%)
        const progress = 50 + Math.round(((i + 1) / batches.length) * 50);
        setUploadProgress(progress);
      }
    } catch (error) {
      console.error('Error saving contacts to database:', error);
      throw new Error('Failed to save contacts to the database');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="flex-1"
            />
            <Button disabled={isUploading}>
              {isUploading ? 'Uploading...' : <Upload className="h-4 w-4 mr-2" />}
              Upload
            </Button>
          </div>
          
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          
          {uploadedContacts.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>Successfully uploaded {uploadedContacts.length} contacts</span>
              </div>
            </div>
          )}
          
          {errors.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <XCircle className="h-5 w-5" />
                <span>Errors found in upload:</span>
              </div>
              <ul className="text-sm list-disc pl-6 space-y-1 text-red-600">
                {errors.slice(0, 5).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
                {errors.length > 5 && <li>...and {errors.length - 5} more errors</li>}
              </ul>
            </div>
          )}
          
          <div className="text-sm text-gray-500 mt-2">
            <p>Upload a CSV file with the following columns:</p>
            <p><strong>Required:</strong> name, phone</p>
            <p><strong>Optional:</strong> email, company, notes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactUploader;