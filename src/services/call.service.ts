export async function startDemoCall(toNumbers: string[]) {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/call`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ to: toNumbers[0] })  // For now, handle one number at a time
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Call initiation failed.");
  }

  return await response.json();
}
