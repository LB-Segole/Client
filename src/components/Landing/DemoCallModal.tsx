import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, X } from "lucide-react";
import { startDemoCall } from "@/services/call.service";

interface DemoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoCallModal: React.FC<DemoCallModalProps> = ({ isOpen, onClose }) => {
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([""]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  if (!isOpen) return null;

  const handleNumberChange = (index: number, value: string) => {
    const updated = [...phoneNumbers];
    updated[index] = value;
    setPhoneNumbers(updated);
  };

  const addPhoneField = () => {
    setPhoneNumbers([...phoneNumbers, ""]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setStatus("submitting");

    // Filter out blank or invalid numbers (need ≥10 digits)
    const validNumbers = phoneNumbers
      .map((n) => n.trim())
      .filter((n) => n.replace(/\D/g, "").length >= 10);
    if (validNumbers.length === 0) {
      alert("Please enter at least one valid phone number (10+ digits).");
      setStatus("idle");
      return;
    }

    try {
      await startDemoCall(validNumbers);
      setStatus("success");
      setMessage("✅ Calls initiated! Please answer your phone(s).");

      // Auto-close after 4s
      setTimeout(() => {
        onClose();
        setStatus("idle");
        setPhoneNumbers([""]);
        setMessage("");
      }, 4000);
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage("❌ Failed to initiate calls. Please try again.");
    }
  };

  const handleClose = () => {
    onClose();
    setStatus("idle");
    setPhoneNumbers([""]);
    setMessage("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full relative overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="bg-indigo-100 text-indigo-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone className="h-6 w-6" />
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">Try a Demo Call</h2>
          <p className="text-gray-600 text-center mb-6">
            Enter one or more phone numbers and our AI will call them.
          </p>

          {(status === "success" || status === "error") && (
            <div className="text-center mb-4">
              <div
                className={`p-4 rounded-md ${
                  status === "success"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                <p>{message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {phoneNumbers.map((number, idx) => (
              <div className="mb-4" key={idx}>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={number}
                  onChange={(e) => handleNumberChange(idx, e.target.value)}
                  className="w-full"
                  disabled={status === "submitting"}
                />
              </div>
            ))}

            <Button
              type="button"
              onClick={addPhoneField}
              className="mb-4 w-full border border-indigo-300 text-indigo-600 hover:bg-indigo-50"
            >
              Add Another Number
            </Button>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Processing..." : "Request Demo Call"}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-4">
              By clicking, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>

        <div className="bg-gray-50 px-6 py-4 text-sm text-gray-500 text-center border-t">
          Want a full demo?{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            Book with our team
          </a>
        </div>
      </div>
    </div>
  );
};

export default DemoCallModal;
