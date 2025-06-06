// src/pages/AIAgent.tsx

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, PhoneCall } from "lucide-react";
import { startDemoCall } from "@/services/call.service";

interface Assistant {
  id: string;
  name: string;
  personality: string;
  voiceStyle: string;
  defaultHelloMessage: string;
  audioSample: string; // URL to an mp3/ogg sample
}

const assistants: Assistant[] = [
  {
    id: "gemma",
    name: "Gemma",
    personality: "Confident, Charismatic, Bold",
    voiceStyle: "Bold",
    defaultHelloMessage:
      "Charismatic AI assistant. I’m here to help you connect with your customers in a confident and engaging way. Let’s make this conversation memorable!",
    audioSample: "/preview_gemma.mp3",
  },
  {
    id: "kat",
    name: "Kat",
    personality: "Calm, Supportive, Thoughtful",
    voiceStyle: "Calm",
    defaultHelloMessage:
      "Hi there! I’m Kat, your friendly and calm AI assistant. I’m here to provide you with thoughtful and helpful support. How can I assist you today?",
    audioSample: "/preview_kat.mp3",
  },
  {
    id: "mark",
    name: "Mark",
    personality: "Formal, Direct, Focused, Strict",
    voiceStyle: "Formal",
    defaultHelloMessage:
      "Good day. I am Mark, your professional AI assistant. I will provide you with direct and focused assistance. How may I help you today?",
    audioSample: "/preview_mark.mp3",
  },
];

const AIAgent: React.FC = () => {
  // Track which audio is playing (by assistant.id)
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  // Keep a reference to the HTMLAudioElement so we can pause it if needed
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Track whether each assistant is “active” (true/false)
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({
    gemma: false,
    kat: false,
    mark: false,
  });

  // Keep track of each assistant's custom “Hello Message”
  const [helloMessages, setHelloMessages] = useState<Record<string, string>>({
    gemma: assistants.find((a) => a.id === "gemma")!.defaultHelloMessage,
    kat: assistants.find((a) => a.id === "kat")!.defaultHelloMessage,
    mark: assistants.find((a) => a.id === "mark")!.defaultHelloMessage,
  });

  /** Toggle “active” on/off for a given assistant */
  const handleActiveToggle = (assistantId: string) => {
    setActiveStates((prev) => ({
      gemma: false,
      kat: false,
      mark: false,
      [assistantId]: !prev[assistantId],
    }));
  };

  /** User edits the Hello Message in the textarea */
  const handleHelloMessageChange = (assistantId: string, message: string) => {
    setHelloMessages((prev) => ({
      ...prev,
      [assistantId]: message,
    }));
  };

  /** PLAY / PAUSE the sample audio for a given assistant */
  const handlePlaySample = (assistantId: string, audioUrl: string) => {
    // If we are already playing this assistant's audio, pause it.
    if (playingAudioId === assistantId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = null;
      setPlayingAudioId(null);
      return;
    }

    // Otherwise, start playing the new sample.
    // If another sample was playing, pause that first:
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Create a brand new Audio object, play it, and store it in the ref.
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio
      .play()
      .then(() => {
        setPlayingAudioId(assistantId);
      })
      .catch((err) => {
        console.error("Error playing audio sample:", err);
        setPlayingAudioId(null);
        audioRef.current = null;
      });

    // When the audio ends, clear the state so the Play button reverts:
    audio.onended = () => {
      setPlayingAudioId(null);
      audioRef.current = null;
    };
  };

  /** SAVE the configuration (Hello Messages, active toggles) to the backend.
   *  (We assume you have a /voice/configure endpoint that picks up runtime_config.) */
  const handleSaveConfig = () => {
    // Build the payload:
    const configPayload = {
      gemma: {
        first_message: helloMessages["gemma"],
        voice_name: "gemma_voice_id_or_token", // replace with your actual ElevenLabs voice name
        second_message:
          "Hello yourself (Gemma) — “Second message if user says Hello.”",
        closing_message: "Thanks for calling. Goodbye.",
      },
      kat: {
        first_message: helloMessages["kat"],
        voice_name: "kat_voice_id_or_token",
        second_message: "If user says Hello, Kat responds …",
        closing_message: "Thank you. Goodbye.",
      },
      mark: {
        first_message: helloMessages["mark"],
        voice_name: "mark_voice_id_or_token",
        second_message: "If user says Hello, Mark responds …",
        closing_message: "Goodbye.",
      },
    };

    // Send a POST to /voice/configure (Flask side)
    fetch(`${import.meta.env.VITE_BACKEND_URL}/voice/configure`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(configPayload),
    })
      .then((res) => {
        if (res.ok) {
          alert("Configuration saved successfully.");
        } else {
          alert("Failed to save configuration.");
        }
      })
      .catch((err) => {
        console.error("Error saving config:", err);
        alert("Error saving configuration.");
      });
  };

  /** START a Test Call via SignalWire */
  const handleTestCall = () => {
    // We send our single-number array to `startDemoCall(...)`.
    // It uses `/voice/test_call` under the hood.
    startDemoCall([import.meta.env.VITE_APP_PHONE_NUMBER as string])
      .then((json) => {
        // json should look like: { status: "Call initiated", sid: "XYZ" }
        alert("Test call started! SID=" + json.sid);
      })
      .catch((err) => {
        console.error("Error initiating test call:", err);
        alert("Failed to start test call. See console for details.");
      });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">AI Agent Configuration</h1>
        <p className="text-gray-600">
          Choose and configure your AI voice assistant
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {assistants.map((assistant) => (
          <Card
            key={assistant.id}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="text-xl font-bold">{assistant.name}</span>
                <Switch
                  checked={activeStates[assistant.id]}
                  onCheckedChange={() => handleActiveToggle(assistant.id)}
                />
              </CardTitle>
              <p className="text-sm text-gray-600 italic">
                {assistant.personality}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voice Style
                </label>
                <div className="px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700">
                  {assistant.voiceStyle}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hello Message
                </label>
                <Textarea
                  value={helloMessages[assistant.id]}
                  onChange={(e) =>
                    handleHelloMessageChange(assistant.id, e.currentTarget.value)
                  }
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Button
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  onClick={() =>
                    handlePlaySample(assistant.id, assistant.audioSample)
                  }
                >
                  {playingAudioId === assistant.id ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play Sample
                    </>
                  )}
                </Button>

                <span className="text-xs text-gray-500">Status:</span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    activeStates[assistant.id]
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {activeStates[assistant.id] ? "Active" : "Inactive"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <Button
          className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
          onClick={handleSaveConfig}
        >
          Save Configuration
        </Button>

        <Button
          className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center"
          onClick={handleTestCall}
        >
          <PhoneCall className="w-4 h-4 mr-2 inline-block" />
          Start Test Call
        </Button>
      </div>
    </div>
  );
};

export default AIAgent;
