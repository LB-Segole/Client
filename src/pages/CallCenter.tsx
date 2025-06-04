import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Play, Pause, Square, Mic, MicOff } from 'lucide-react';
import CallVisualization from '@/components/CallCenter/CallVisualization';
import CampaignForm from '@/components/CallCenter/CampaignForm';
import ContactUploader from '@/components/CallCenter/ContactUploader';

type CallStatus = 'idle' | 'calling' | 'connected' | 'completed';

const CallCenter = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [currentContact, setCurrentContact] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'calling' || callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const startCall = () => {
    setIsCallActive(true);
    setCallStatus('calling');
    setCurrentContact('+1-555-0123');
    setCallDuration(0);
    
    // Simulate call connection after 3 seconds
    setTimeout(() => {
      setCallStatus('connected');
    }, 3000);
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallStatus('completed');
    setTimeout(() => {
      setCallStatus('idle');
      setCallDuration(0);
    }, 2000);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Call Center</h1>
        <p className="text-gray-600">Manage your AI-powered calling campaigns</p>
      </div>

      {/* Call Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone size={20} />
            Live Call Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Status: <span className="font-medium capitalize">{callStatus}</span></p>
              {currentContact && (
                <p className="text-sm text-gray-600">Contact: <span className="font-medium">{currentContact}</span></p>
              )}
              {callDuration > 0 && (
                <p className="text-sm text-gray-600">Duration: <span className="font-medium">{formatDuration(callDuration)}</span></p>
              )}
            </div>
            
            <div className="flex gap-2">
              {!isCallActive ? (
                <Button onClick={startCall} className="bg-green-600 hover:bg-green-700">
                  <Play size={16} className="mr-2" />
                  Start Call
                </Button>
              ) : (
                <>
                  <Button onClick={toggleMute} variant="outline" className={isMuted ? 'bg-red-100' : ''}>
                    {isMuted ? <MicOff size={16} className="mr-2" /> : <Mic size={16} className="mr-2" />}
                    {isMuted ? 'Unmute' : 'Mute'}
                  </Button>
                  <Button onClick={endCall} variant="destructive">
                    <Square size={16} className="mr-2" />
                    End Call
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call Visualization */}
      {isCallActive && <CallVisualization callStatus={callStatus} isMuted={isMuted} />}

      {/* Campaign Management */}
      <div className="grid md:grid-cols-2 gap-8">
        <CampaignForm />
        <ContactUploader />
      </div>
    </div>
  );
};

export default CallCenter;