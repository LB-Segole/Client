let socket: WebSocket | null = null;
let audioContext: AudioContext | null = null;
let sourceNode: MediaStreamAudioSourceNode | null = null;
let processorNode: ScriptProcessorNode | null = null;

export const startStreaming = async (mediaStream: MediaStream) => {
  if (socket || audioContext) return;

  socket = new WebSocket("wss://your-backend-url/stream"); // TODO: Replace with env or full backend URL
  audioContext = new AudioContext();
  sourceNode = audioContext.createMediaStreamSource(mediaStream);
  processorNode = audioContext.createScriptProcessor(4096, 1, 1);

  processorNode.onaudioprocess = (event) => {
    if (socket?.readyState === WebSocket.OPEN) {
      const inputData = event.inputBuffer.getChannelData(0);
      const pcm = convertFloat32ToInt16(inputData);
      socket.send(pcm);
    }
  };

  sourceNode.connect(processorNode);
  processorNode.connect(audioContext.destination);

  socket.binaryType = "arraybuffer";
  socket.onmessage = (event) => {
    const audioData = event.data as ArrayBuffer;
    playAudioChunk(audioData);
  };

  socket.onclose = () => console.log("WebSocket closed");
  socket.onerror = (err) => console.error("WebSocket error:", err);
};

export const stopStreaming = () => {
  processorNode?.disconnect();
  sourceNode?.disconnect();
  audioContext?.close();

  if (socket?.readyState === WebSocket.OPEN) {
    socket.close();
  }

  processorNode = null;
  sourceNode = null;
  audioContext = null;
  socket = null;
};

function convertFloat32ToInt16(buffer: Float32Array): Int16Array {
  const l = buffer.length;
  const result = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    const s = Math.max(-1, Math.min(1, buffer[i]));
    result[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return result;
}

function playAudioChunk(arrayBuffer: ArrayBuffer) {
  if (!audioContext) return;
  audioContext.decodeAudioData(arrayBuffer.slice(0), (buffer) => {
    const source = audioContext!.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext!.destination);
    source.start();
  });
}
