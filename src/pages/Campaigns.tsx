import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ListChecks, Plus, BarChart, Phone, Play, Pause, Edit, Trash2 } from 'lucide-react';
import { Campaign } from '@/types';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Q2 Sales Outreach',
      description: 'Follow up with Q1 leads to convert to paying customers',
      scriptId: 'script-1',
      status: 'active',
      createdAt: '2023-04-15T10:30:00Z',
      updatedAt: '2023-04-15T10:30:00Z',
    },
    {
      id: '2',
      name: 'Appointment Reminders',
      description: 'Call to confirm upcoming appointments',
      scriptId: 'script-2',
      status: 'active',
      createdAt: '2023-04-10T14:20:00Z',
      updatedAt: '2023-04-12T09:15:00Z',
    },
    {
      id: '3',
      name: 'Customer Feedback',
      description: 'Collect feedback from recent customers',
      scriptId: 'script-3',
      status: 'paused',
      createdAt: '2023-04-05T11:45:00Z',
      updatedAt: '2023-04-08T16:30:00Z',
    },
    {
      id: '4',
      name: 'Event Follow-up',
      description: 'Follow up with attendees from the recent webinar',
      scriptId: 'script-4',
      status: 'completed',
      createdAt: '2023-03-22T09:00:00Z',
      updatedAt: '2023-04-01T12:20:00Z',
    },
  ]);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
  });
  
  const handleCreateCampaign = () => {
    // Validate form
    if (!newCampaign.name) {
      toast.error('Please enter a campaign name');
      return;
    }
    
    // Create new campaign
    const campaign: Campaign = {
      id: `campaign-${Date.now()}`,
      name: newCampaign.name,
      description: newCampaign.description,
      scriptId: `script-${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setCampaigns([campaign, ...campaigns]);
    setNewCampaign({ name: '', description: '' });
    setIsCreateModalOpen(false);
    
    toast.success('Campaign created', {
      description: `"${campaign.name}" has been created successfully`,
    });
  };
  
  const handleToggleStatus = (id: string) => {
    setCampaigns(campaigns.map(campaign => {
      if (campaign.id === id) {
        const newStatus = campaign.status === 'active' ? 'paused' : 'active';
        
        toast.info(`Campaign ${newStatus}`, {
          description: `"${campaign.name}" is now ${newStatus}`,
        });
        
        return {
          ...campaign,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return campaign;
    }));
  };
  
  const handleDeleteCampaign = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete campaign "${name}"?`)) {
      setCampaigns(campaigns.filter(campaign => campaign.id !== id));
      
      toast.success('Campaign deleted', {
        description: `"${name}" has been deleted successfully`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Campaigns</h1>
          <p className="text-gray-500">Manage and monitor your calling campaigns</p>
        </div>
        
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>
      
      {/* Campaign Cards */}
      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ListChecks className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Campaigns Yet</h3>
            <p className="text-gray-500 text-center mb-6">
              Create your first campaign to start making AI voice calls
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {campaign.description || 'No description provided'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 mb-4">
                  <p>
                    Created: {new Date(campaign.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    Last updated: {new Date(campaign.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="flex-1"
                    onClick={() => handleToggleStatus(campaign.id)}
                  >
                    {campaign.status === 'active' ? (
                      <>
                        <Pause className="mr-1 h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-1 h-4 w-4" />
                        Resume
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.alert('Edit functionality would be implemented here')}
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.alert('Analytics would be displayed here')}
                  >
                    <BarChart className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.alert('Calls would be displayed here')}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCampaign(campaign.id, campaign.name)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Create Campaign Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Enter the details for your new calling campaign
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                placeholder="Enter a name for your campaign"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="campaign-description">Description</Label>
              <Input
                id="campaign-description"
                placeholder="Enter a description (optional)"
                value={newCampaign.description}
                onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign}>
              Create Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Campaigns;