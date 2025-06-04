import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
      });
    }

    const { to } = await req.json();
    if (!to || !Array.isArray(to) || to.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'to' array." }),
        { status: 400 }
      );
    }

    const voiceAgentUrl = Deno.env.get("VOICE_AGENT_API_URL");
    if (!voiceAgentUrl) {
      return new Response(
        JSON.stringify({ error: "VOICE_AGENT_API_URL not set" }),
        { status: 500 }
      );
    }

    const resp = await fetch(`${voiceAgentUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(
        JSON.stringify({ error: `Voice agent error: ${errText}` }),
        { status: 500 }
      );
    }

    const data = await resp.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Supabase Edge Function Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
});
