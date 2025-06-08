class MicProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input.length > 0) {
      const channelData = input[0];
      const float32 = new Float32Array(channelData);
      this.port.postMessage(float32.buffer, [float32.buffer]);
    }
    return true;
  }
}

registerProcessor('mic-processor', MicProcessor);
