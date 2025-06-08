import React, { useEffect, useRef, useState } from 'react';

const BACKEND_WS_URL = import.meta.env.VITE_BACKEND_WS_URL || 'wss://web-production-4506.up.railway.app/ws/ai-stream';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://web-production-4506.up.railway.app';

export default function CallCenter() {
  const [connected, setConnected] = useState(false);
  const [calling, setCalling] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNode = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorNode = useRef<AudioWorkletNode | null>(null);

  useEffect(() => {
    return () => stopAudio();
  }, []);

  const startAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;

    await audioCtx.audioWorklet.addModule('/audio/processor.js');
    sourceNode.current = audioCtx.createMediaStreamSource(stream);
    processorNode.current = new AudioWorkletNode(audioCtx, 'mic-processor');

    processorNode.current.port.onmessage = (event) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(event.data);
      }
    };

    sourceNode.current.connect(processorNode.current);
    processorNode.current.connect(audioCtx.destination);
  };

  const startCall = async () => {
    try {
      setCalling(true);

      // Step 1: Trigger actual phone call
      const res = await fetch(`${BACKEND_URL}/voice/outbound`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: import.meta.env.VITE_TO_PHONE || '+17193017849',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Call failed.');
      }

      // Step 2: Start WebSocket audio stream
      ws.current = new WebSocket(BACKEND_WS_URL);
      ws.current.binaryType = 'arraybuffer';

      ws.current.onopen = () => {
        setConnected(true);
        startAudio();
      };

      ws.current.onmessage = (event) => {
        playTTS(event.data);
      };

      ws.current.onclose = () => {
        setConnected(false);
        stopAudio();
      };

    } catch (err) {
      console.error('Call error:', err);
      alert('Failed to start call: ' + err.message);
    } finally {
      setCalling(false);
    }
  };

  const stopAudio = () => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.close();
    }
  };

  const playTTS = (buffer: ArrayBuffer) => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;

    audioCtx.decodeAudioData(buffer.slice(0), (decodedData) => {
      const source = audioCtx.createBufferSource();
      source.buffer = decodedData;
      source.connect(audioCtx.destination);
      source.start();
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Live AI Call Center</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={startCall}
        disabled={calling || connected}
      >
        {calling ? 'Calling...' : connected ? 'Connected' : 'Start Call'}
      </button>
    </div>
  );
}
