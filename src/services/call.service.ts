import { createClient } from "@supabase/supabase-js";

// Initialize Supabase (reads VITE_ env)
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export async function startDemoCall(toNumbers: string[]) {
  // Invoke Supabase Edge Function “make-outbound-call” with an array of numbers.
  const { data, error } = await supabase.functions.invoke("make-outbound-call", {
    body: { to: toNumbers },
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
