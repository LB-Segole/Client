export async function startDemoCall(toNumbers: string[]) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/voice/outbound`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // We only need to pass one number at a time for now. 
      body: JSON.stringify({ to: toNumbers[0] }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Call initiation failed.");
  }

  return await response.json();
}
