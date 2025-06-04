import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, Search, Download, Calendar, Clock, Info, User, Check, X, PhoneForwarded, Eye } from 'lucide-react';
import { Call } from '@/types';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const CallHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Mock call data
  const mockCalls: Call[] = [
    {
      id: '1',
      campaignId: '1',
      contactId: 'contact-1',
      status: 'completed',
      startTime: '2023-05-18T10:30:00Z',
      endTime: '2023-05-18T10:34:23Z',
      duration: 263,
      transcript: 'AI: Hello, this is AIVoiceCaller... \nCustomer: Hi, yes I was expecting your call...',
      notes: 'Customer expressed interest in premium plan',
    },
    {
      id: '2',
      campaignId: '1',
      contactId: 'contact-2',
      status: 'failed',
      startTime: '2023-05-18T10:45:00Z',
      endTime: '2023-05-18T10:45:12Z',
      duration: 12,
      transcript: 'Call failed to connect',
      notes: 'No answer after 4 rings',
    },
    {
      id: '3',
      campaignId: '2',
      contactId: 'contact-3',
      status: 'transferred',
      startTime: '2023-05-18T11:15:00Z',
      endTime: '2023-05-18T11:22:45Z',
      duration: 465,
      transcript: 'AI: Hello, this is AIVoiceCaller... \nCustomer: I need to speak with a human agent...',
      notes: 'Transferred to sales department',
    },
    {
      id: '4',
      campaignId: '2',
      contactId: 'contact-4',
      status: 'completed',
      startTime: '2023-05-18T13:05:00Z',
      endTime: '2023-05-18T13:11:30Z',
      duration: 390,
      transcript: 'AI: Hello, this is AIVoiceCaller... \nCustomer: Yes, I can confirm my appointment...',
      notes: 'Appointment confirmed for Friday at 2pm',
    },
    {
      id: '5',
      campaignId: '3',
      contactId: 'contact-5',
      status: 'completed',
      startTime: '2023-05-17T09:30:00Z',
      endTime: '2023-05-17T09:37:20Z',
      duration: 440,
      transcript: 'AI: Hello, this is AIVoiceCaller... \nCustomer: I\'d love to provide some feedback...',
      notes: 'Customer gave positive feedback about recent purchase',
    },
    {
      id: '6',
      campaignId: '3',
      contactId: 'contact-6',
      status: 'in-progress',
      startTime: '2023-05-19T14:25:00Z',
      endTime: undefined,
      duration: undefined,
      transcript: 'Call in progress...',
      notes: '',
    },
  ];
  
  // Filter calls based on search query and status filter
  const filteredCalls = mockCalls.filter(call => {
    const matchesSearch = call.id.includes(searchQuery) || 
                          call.contactId.includes(searchQuery) ||
                          (call.notes && call.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || call.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Function to format duration in mm:ss format
  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // View call details
  const handleViewDetails = (call: Call) => {
    setSelectedCall(call);
    setIsDetailModalOpen(true);
  };
  
  // Download transcript
  const handleDownloadTranscript = (call: Call) => {
    toast.success('Transcript download started', {
      description: `Downloading transcript for call ${call.id}`,
    });
    
    // In a real app, this would initiate an actual download
    setTimeout(() => {
      toast.success('Transcript downloaded successfully');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Call History</h1>
        <p className="text-gray-500">View and analyze your AI voice calls</p>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search calls by ID, contact, or notes"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="transferred">Transferred</option>
            <option value="in-progress">In Progress</option>
          </select>
          
          <Button variant="outline">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Calls list */}
      {filteredCalls.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Phone className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Calls Found</h3>
            <p className="text-gray-500 text-center">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try changing your search or filters'
                : 'Start a campaign to begin making calls'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Call Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Date & Time</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Duration</th>
                    <th className="text-left py-3 px-4">Contact</th>
                    <th className="text-left py-3 px-4">Notes</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCalls.map((call) => (
                    <tr key={call.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{call.id}</td>
                      <td className="py-3 px-4">
                        {new Date(call.startTime).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            call.status === 'completed' ? 'bg-green-100 text-green-800' :
                            call.status === 'failed' ? 'bg-red-100 text-red-800' :
                            call.status === 'transferred' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {call.status === 'completed' && <Check className="mr-1 h-3 w-3" />}
                            {call.status === 'failed' && <X className="mr-1 h-3 w-3" />}
                            {call.status === 'transferred' && <PhoneForwarded className="mr-1 h-3 w-3" />}
                            {call.status === 'in-progress' && <Phone className="mr-1 h-3 w-3" />}
                            {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3 text-gray-500" />
                          {formatDuration(call.duration)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <User className="mr-1 h-3 w-3 text-gray-500" />
                          {call.contactId}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="max-w-xs truncate">
                          {call.notes || 'No notes available'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewDetails(call)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDownloadTranscript(call)}
                          disabled={!call.transcript || call.status === 'in-progress'}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Call Details Modal */}
      {selectedCall && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Call Details</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Call Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Call ID:</span>
                    <span>{selectedCall.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Campaign ID:</span>
                    <span>{selectedCall.campaignId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contact ID:</span>
                    <span>{selectedCall.contactId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className={`${
                      selectedCall.status === 'completed' ? 'text-green-600' :
                      selectedCall.status === 'failed' ? 'text-red-600' :
                      selectedCall.status === 'transferred' ? 'text-blue-600' :
                      'text-yellow-600'
                    }`}>
                      {selectedCall.status.charAt(0).toUpperCase() + selectedCall.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Start Time:</span>
                    <span>{new Date(selectedCall.startTime).toLocaleString()}</span>
                  </div>
                  {selectedCall.endTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">End Time:</span>
                      <span>{new Date(selectedCall.endTime).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration:</span>
                    <span>{formatDuration(selectedCall.duration)}</span>
                  </div>
                </div>
                
                <h3 className="font-medium mt-6 mb-3">Notes</h3>
                <p className="text-sm bg-gray-50 p-3 rounded border">
                  {selectedCall.notes || 'No notes available'}
                </p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Call Transcript</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadTranscript(selectedCall)}
                    disabled={!selectedCall.transcript || selectedCall.status === 'in-progress'}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                
                <div className="bg-gray-50 p-3 rounded border h-[400px] overflow-y-auto">
                  {selectedCall.transcript ? (
                    <pre className="text-sm whitespace-pre-wrap font-sans">
                      {selectedCall.transcript}
                    </pre>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <Info className="mr-2 h-4 w-4" />
                      No transcript available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CallHistory;