import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, PhoneCall } from "lucide-react";

interface Assistant {
  id: string;
  name: string;
  personality: string;
  voiceStyle: string;
  defaultHelloMessage: string;
  audioSample: string;
}

const AIAgent = () => {
  const [assistants] = useState<Assistant[]>([
    {
      id: "gemma",
      name: "Gemma",
      personality: "Confident, Charismatic, Witty, Bold",
      voiceStyle: "Bold",
      defaultHelloMessage:
        "Hello! I'm Gemma, your bold and charismatic AI assistant. I'm here to help you connect with your customers in a confident and engaging way. Let's make this conversation memorable!",
      audioSample: "/audio/gemma-sample.mp3",
    },
    {
      id: "kat",
      name: "Kat",
      personality: "Smart, Friendly, Demure, Calm",
      voiceStyle: "Calm",
      defaultHelloMessage:
        "Hi there! I'm Kat, your friendly and calm AI assistant. I'm here to provide you with thoughtful and helpful support. How can I assist you today?",
      audioSample: "/audio/kat-sample.mp3",
    },
    {
      id: "mark",
      name: "Mark",
      personality: "Formal, Direct, Focused, Strict",
      voiceStyle: "Formal",
      defaultHelloMessage:
        "Good day. I am Mark, your professional AI assistant. I will provide you with direct and focused assistance. How may I help you today?",
      audioSample: "/audio/mark-sample.mp3",
    },
  ]);

  const [helloMessages, setHelloMessages] = useState<{ [key: string]: string }>({
    gemma: assistants[0].defaultHelloMessage,
    kat: assistants[1].defaultHelloMessage,
    mark: assistants[2].defaultHelloMessage,
  });

  const [activeStates, setActiveStates] = useState<{ [key: string]: boolean }>({
    gemma: true,
    kat: false,
    mark: false,
  });

  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const handleHelloMessageChange = (assistantId: string, message: string) => {
    setHelloMessages((prev) => ({
      ...prev,
      [assistantId]: message,
    }));
  };

  const handleActiveToggle = (assistantId: string) => {
    setActiveStates({
      gemma: false,
      kat: false,
      mark: false,
      [assistantId]: !activeStates[assistantId],
    });
  };

  const handlePlaySample = (assistantId: string, audioSample: string) => {
    if (playingAudio === assistantId) {
      setPlayingAudio(null);
      return;
    }

    setPlayingAudio(assistantId);
    setTimeout(() => {
      setPlayingAudio(null);
    }, 3000);
  };

  const handleSaveConfig = async () => {
    const activeAssistant = assistants.find((a) => activeStates[a.id]);
    if (!activeAssistant) {
      alert("Please activate an assistant first.");
      return;
    }

    const configPayload = {
      openai_model: "gpt-4",
      temperature: 0.7,
      max_tokens: 500,
      system_prompt: `You are ${activeAssistant.name}, ${activeAssistant.personality}`,
      first_message_mode: "assistant_custom",
      first_message: helloMessages[activeAssistant.id],
      deepgram_model: "nova",
      deepgram_voice: activeAssistant.voiceStyle.toLowerCase(),
      voice_name: activeAssistant.name,
      voice_gender: activeAssistant.voiceStyle === "Formal" ? "male" : "female",
    };

    try {
      const res = await fetch("/voice/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configPayload),
      });

      if (!res.ok) throw new Error("Failed to save config");

      alert("Configuration saved successfully.");
    } catch (err) {
      alert("Error saving configuration.");
      console.error(err);
    }
  };

  const handleTestCall = () => {
    fetch("/voice/test_call", { method: "POST" })
      .then((res) => (res.ok ? alert("Test call started.") : alert("Failed to start test call.")))
      .catch(() => alert("Error starting test call."));
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">AI Agent Configuration</h1>
        <p className="text-gray-600">Choose and configure your AI voice assistant</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assistants.map((assistant) => (
          <Card key={assistant.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="text-xl font-bold">{assistant.name}</span>
                <Switch
                  checked={activeStates[assistant.id]}
                  onCheckedChange={() => handleActiveToggle(assistant.id)}
                />
              </CardTitle>
              <p className="text-sm text-gray-600 italic">{assistant.personality}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Voice Style</label>
                <div className="px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700">
                  {assistant.voiceStyle}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hello Message</label>
                <Textarea
                  value={helloMessages[assistant.id]}
                  onChange={(e) => handleHelloMessageChange(assistant.id, e.target.value)}
                  placeholder="Enter the first message this assistant will say..."
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Voice Preview</label>
                <Button
                  onClick={() => handlePlaySample(assistant.id, assistant.audioSample)}
                  variant="outline"
                  className="w-full"
                  disabled={playingAudio !== null && playingAudio !== assistant.id}
                >
                  {playingAudio === assistant.id ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Playing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play Sample
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-gray-500">Status:</span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    activeStates[assistant.id] ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {activeStates[assistant.id] ? "Active" : "Inactive"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-6 space-x-4">
        <Button className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSaveConfig}>
          Save Configuration
        </Button>

        <Button className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white" onClick={handleTestCall}>
          <PhoneCall className="w-4 h-4 mr-2 inline-block" />
          Start Test Call
        </Button>
      </div>
    </div>
  );
};

export default AIAgent;
