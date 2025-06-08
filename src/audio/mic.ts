export async function getMicStream(): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return stream;
  } catch (err) {
    console.error("Failed to get mic access", err);
    throw err;
  }
}