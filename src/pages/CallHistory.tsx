// src/pages/CallHistory.tsx

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CallLog {
  timestamp: string;
  direction: string;   // "inbound" or "outbound"
  caller: string;
  transcript: string;
  ai_response: string;
}

const CallHistory: React.FC = () => {
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const resp = await fetch("/api/logs");
        if (!resp.ok) {
          const err = await resp.json();
          throw new Error(err.message || "Failed to fetch logs");
        }
        const data: CallLog[] = await resp.json();
        setLogs(data);
      } catch (e) {
        const message = e instanceof Error ? e.message : "An unknown error occurred";
        console.error("Error fetching call logs:", e);
        setError(e.message);
        toast.error("Could not load call logs.");
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading call history…</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Call History</h2>

      {logs.length === 0 ? (
        <p>No calls have been logged yet.</p>
      ) : (
        logs.map((log, idx) => (
          <Card key={idx} className="mb-4 shadow hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>
                {new Date(log.timestamp).toLocaleString()} — {log.direction.toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Caller:</strong> {log.caller}
              </p>
              <p>
                <strong>Transcript:</strong> {log.transcript || "<none>"}
              </p>
              <p>
                <strong>AI Response:</strong> {log.ai_response || "<none>"}
              </p>
              <button
                className="mt-2 text-blue-600 hover:underline"
                onClick={() => {
                  setSelectedLog(log);
                  setIsDetailOpen(true);
                }}
              >
                View Details
              </button>
            </CardContent>
          </Card>
        ))
      )}

      {selectedLog && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Call Detail</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p>
                <strong>Timestamp:</strong>{" "}
                {new Date(selectedLog.timestamp).toLocaleString()}
              </p>
              <p>
                <strong>Direction:</strong> {selectedLog.direction}
              </p>
              <p>
                <strong>Caller:</strong> {selectedLog.caller}
              </p>
              <p>
                <strong>Transcript:</strong> {selectedLog.transcript}
              </p>
              <p>
                <strong>AI Response:</strong> {selectedLog.ai_response}
              </p>
            </div>
            <div className="mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setIsDetailOpen(false)}
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CallHistory;
