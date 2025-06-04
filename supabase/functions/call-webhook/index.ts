import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DeepgramClient } from "https://esm.sh/@deepgram/sdk@2.4.0";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookData = await req.json();
    console.log('Received call webhook:', JSON.stringify(webhookData, null, 2));

    const callId = webhookData.call_id || '';
    const event = webhookData.event || '';
    const callDbId = webhookData.headers?.['X-Call-ID'] || '';
    const campaignId = webhookData.headers?.['X-Campaign-ID'] || '';

    // Initialize API clients
    const deepgram = new DeepgramClient(Deno.env.get('DEEPGRAM_API_KEY') || '');
    const openai = new OpenAIApi(
      new Configuration({
        apiKey: Deno.env.get('OPENAI_API_KEY') || '',
      })
    );

    // Handle different call events
    switch (event) {
      case 'answered':
        // Call was answered, start AI conversation
        console.log('Call was answered, preparing AI agent');
        
        // Update call status in database
        await updateCallStatus(callDbId, 'connected');
        
        // Get campaign script and context
        const campaign = await getCampaign(campaignId);
        
        // Start AI conversation
        // This is a simplified example - in a real app, you would use SignalWire's
        // media handling to stream audio to Deepgram and OpenAI
        const initialPrompt = campaign?.script || 'Hello, this is an AI assistant calling.';
        
        // In a real implementation, you would:
        // 1. Process the audio with Deepgram in real-time
        // 2. Send the transcribed text to OpenAI
        // 3. Convert OpenAI's response to speech and play it on the call
        break;
        
      case 'machine_detected':
        // Voicemail detected
        console.log('Voicemail detected');
        await updateCallStatus(callDbId, 'no-answer');
        // Here you would typically leave a voicemail message
        break;
        
      case 'ended':
        // Call ended
        console.log('Call ended');
        const duration = webhookData.duration || 0;
        
        await updateCall(callDbId, {
          status: 'completed',
          endTime: new Date().toISOString(),
          duration: duration
        });
        
        // Process and store the recording if available
        if (webhookData.recording_url) {
          await processRecording(callDbId, webhookData.recording_url);
        }
        break;
        
      case 'failed':
        // Call failed
        console.log('Call failed');
        await updateCallStatus(callDbId, 'failed');
        break;
        
      default:
        console.log('Unhandled event:', event);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error processing call webhook:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to process webhook' 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

// Helper functions to interact with database
async function updateCallStatus(callId: string, status: string) {
  return updateCall(callId, { status });
}

async function updateCall(callId: string, updateData: any) {
  try {
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/calls?id=eq.${callId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_KEY')}`,
        'apikey': Deno.env.get('SUPABASE_SERVICE_KEY') || ''
      },
      body: JSON.stringify(updateData)
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating call:', error);
    return false;
  }
}

async function getCampaign(campaignId: string) {
  try {
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/campaigns?id=eq.${campaignId}&select=*`, {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_KEY')}`,
        'apikey': Deno.env.get('SUPABASE_SERVICE_KEY') || ''
      }
    });
    const campaigns = await response.json();
    return campaigns[0] || null;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return null;
  }
}

async function processRecording(callId: string, recordingUrl: string) {
  try {
    // Download the recording
    const recordingResponse = await fetch(recordingUrl);
    const recordingBuffer = await recordingResponse.arrayBuffer();
    
    // Transcribe with Deepgram
    const deepgram = new DeepgramClient(Deno.env.get('DEEPGRAM_API_KEY') || '');
    
    const transcriptionResponse = await deepgram.transcription.preRecorded({
      buffer: new Uint8Array(recordingBuffer),
      mimetype: 'audio/mp3',
    }, {
      punctuate: true,
      diarize: true,
      utterances: true,
    });
    
    const transcript = transcriptionResponse.results?.channels[0]?.alternatives[0]?.transcript || '';
    
    // Update the call record with the transcript
    await updateCall(callId, { 
      transcript, 
      transcriptUrl: recordingUrl,  // In a real app, you might store this separately
      recordingUrl 
    });
    
    return true;
  } catch (error) {
    console.error('Error processing recording:', error);
    return false;
  }
}