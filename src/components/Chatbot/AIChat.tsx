import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, X, Phone, Loader2, Calendar } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: Date;
}

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hi there! I'm Sarah, your AI assistant from AIVoiceCaller. I'm here to help you understand our AI voice calling platform and answer any questions you might have. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      sender: 'user',
      text: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);
    
    try {
      // Simulate AI response with a short delay
      setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'system',
        text: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }
  };

  // Enhanced conversational AI response generator
  const generateAIResponse = (userMessage: string): string => {
    const normalizedMessage = userMessage.toLowerCase();
    
    // Greeting responses
    if (normalizedMessage.includes('hello') || normalizedMessage.includes('hi') || normalizedMessage.includes('hey')) {
      return "Hello! Great to meet you! I'm really excited to tell you about AIVoiceCaller. We're revolutionizing how businesses communicate with their customers using AI. What brings you here today? Are you looking to automate your calling processes?";
    }
    
    // Pricing related
    if (normalizedMessage.includes('pricing') || normalizedMessage.includes('cost') || normalizedMessage.includes('price') || normalizedMessage.includes('how much')) {
      return "That's a great question! We've moved to a simple pay-as-you-go model because we believe you should only pay for what you use. Our Basic calls start at just $0.15 per minute, Premium calls at $0.25 per minute, and Enterprise calls at $0.40 per minute. Plus, we offer volume discounts! New users get $10 in free credits to try everything out. Would you like me to explain the differences between our tiers?";
    }
    
    // Features related
    if (normalizedMessage.includes('features') || normalizedMessage.includes('what can') || normalizedMessage.includes('capabilities') || normalizedMessage.includes('what does it do')) {
      return "I'm so glad you asked! AIVoiceCaller is packed with amazing features. We have natural-sounding AI voices that can have real conversations, campaign management tools, real-time call monitoring, detailed analytics, CRM integration, and even custom voice training. Our AI can handle sales calls, appointment reminders, surveys, and lead qualification. What type of calling would you be most interested in automating?";
    }
    
    // How it works
    if (normalizedMessage.includes('how does it work') || normalizedMessage.includes('how do you') || normalizedMessage.includes('process') || normalizedMessage.includes('explain')) {
      return "It's actually quite simple and exciting! First, you create a campaign and upload your contact list. Then you choose one of our AI voices and customize the conversation script. Our AI then makes the calls, has natural conversations with your contacts, and provides you with real-time transcripts and analytics. The whole process is automated, but you stay in complete control. Would you like to see a demo of how it works?";
    }
    
    // Demo requests
    if (normalizedMessage.includes('demo') || normalizedMessage.includes('try') || normalizedMessage.includes('test') || normalizedMessage.includes('show me')) {
      return "Absolutely! I'd love to show you what our AI can do. You can try our demo call feature right now, or I can schedule a personalized walkthrough with one of our specialists. The demo call will let you experience our AI voice technology firsthand. Which would you prefer - the instant demo or a scheduled walkthrough?";
    }
    
    // Support/human agent requests
    if (normalizedMessage.includes('speak') || normalizedMessage.includes('human') || normalizedMessage.includes('agent') || normalizedMessage.includes('support') || normalizedMessage.includes('help me')) {
      return "Of course! I completely understand wanting to speak with a human. Our team is fantastic and they'd love to help you personally. I can connect you with one of our specialists right away. Would you prefer a phone call or to continue chatting? If you'd like a call, I can schedule one at your convenience.";
    }
    
    // Scheduling requests
    if (normalizedMessage.includes('schedule') || normalizedMessage.includes('appointment') || normalizedMessage.includes('meeting') || normalizedMessage.includes('call me') || normalizedMessage.includes('when can')) {
      setShowScheduling(true);
      return "Perfect! I'd be happy to schedule a call for you with one of our specialists. They can give you a personalized demo and answer all your questions. We're available Monday through Friday, 8 AM to 6 PM (PKT). What day and time works best for you this week?";
    }
    
    // Industry/use case questions
    if (normalizedMessage.includes('business') || normalizedMessage.includes('industry') || normalizedMessage.includes('company') || normalizedMessage.includes('use case')) {
      return "That's wonderful! We work with businesses of all sizes across many industries. Whether you're in real estate, healthcare, e-commerce, insurance, or any other field, our AI can adapt to your specific needs. We've helped companies increase their conversion rates by up to 40% while reducing calling costs. What industry are you in? I'd love to share some specific examples of how we've helped similar businesses!";
    }
    
    // Technical questions
    if (normalizedMessage.includes('api') || normalizedMessage.includes('integration') || normalizedMessage.includes('crm') || normalizedMessage.includes('technical')) {
      return "Great technical question! We offer comprehensive API access, especially with our Premium and Enterprise tiers. We integrate seamlessly with popular CRMs like Salesforce, HubSpot, and Pipedrive. We also support webhooks for real-time data sync and have pre-built connectors for most major business tools. Our technical team can help you set up any custom integrations you might need. Are you looking to integrate with any specific systems?";
    }
    
    // Comparison questions
    if (normalizedMessage.includes('better') || normalizedMessage.includes('different') || normalizedMessage.includes('compared') || normalizedMessage.includes('vs') || normalizedMessage.includes('versus')) {
      return "That's a smart question to ask! What sets us apart is our focus on natural conversations rather than robotic scripts. Our AI actually listens and responds intelligently, making each call feel personal. Plus, our pay-as-you-go pricing means no wasted money on unused minutes. We also offer real-time monitoring and the ability to jump into calls if needed. What other solutions are you comparing us to? I'd be happy to explain the specific advantages!";
    }
    
    // Positive responses
    if (normalizedMessage.includes('great') || normalizedMessage.includes('awesome') || normalizedMessage.includes('perfect') || normalizedMessage.includes('excellent') || normalizedMessage.includes('thank')) {
      return "Thank you so much! I'm really excited that you're interested. Is there anything specific you'd like to know more about? I'm here to help make sure AIVoiceCaller is the perfect fit for your business needs. And remember, you can always start with our free credits to test everything out risk-free!";
    }
    
    // Default friendly response
    return "That's a really good point! I want to make sure I give you the most helpful information. Could you tell me a bit more about what you're looking for? Are you interested in automating sales calls, customer service, appointment scheduling, or something else? The more I know about your needs, the better I can explain how AIVoiceCaller can help transform your business!";
  };

  const handleRequestCall = () => {
    setShowScheduling(true);
    const systemMessage: Message = {
      id: Date.now().toString(),
      sender: 'ai',
      text: "I'd be delighted to arrange a call for you! Our specialists are available Monday through Friday, 8 AM to 6 PM (Pakistan Time). What day and time would work best for you?",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleScheduleSlot = (day: string, time: string) => {
    const confirmMessage: Message = {
      id: Date.now().toString(),
      sender: 'ai',
      text: `Perfect! I've scheduled a call for you on ${day} at ${time} (PKT). One of our specialists will call you to discuss your needs and give you a personalized demo. You'll receive a confirmation email shortly. Is there anything specific you'd like them to focus on during the call?`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmMessage]);
    setShowScheduling(false);
  };

  // Generate available time slots for this week
  const generateTimeSlots = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'];
    
    return days.map(day => ({
      day,
      slots: times
    }));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat bubble button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all"
        >
          <MessageCircle size={24} />
        </button>
      )}
      
      {/* Chat window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl flex flex-col w-80 sm:w-96 h-[600px] max-h-[80vh] overflow-hidden border">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="mr-3 bg-white rounded-full p-1">
                <MessageCircle size={20} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium">Sarah - AI Assistant</h3>
                <p className="text-xs opacity-80">Online | Here to help!</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <X size={18} />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2 ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white'
                      : msg.sender === 'ai'
                        ? 'bg-white border border-gray-200 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs opacity-70 text-right mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Scheduling Interface */}
            {showScheduling && (
              <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-blue-800">Schedule Your Call</h4>
                <div className="space-y-3">
                  {generateTimeSlots().map((daySlot) => (
                    <div key={daySlot.day}>
                      <p className="text-sm font-medium text-blue-700 mb-1">{daySlot.day}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {daySlot.slots.map((time) => (
                          <Button
                            key={`${daySlot.day}-${time}`}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleScheduleSlot(daySlot.day, time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse mr-1"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75 mr-1"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Quick actions */}
          <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
            <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="whitespace-nowrap text-xs"
                onClick={() => {
                  setMessage("Tell me about your features");
                  setTimeout(() => handleSubmit({ preventDefault: () => {} } as React.FormEvent), 100);
                }}
              >
                Features
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="whitespace-nowrap text-xs"
                onClick={() => {
                  setMessage("What are your pricing plans?");
                  setTimeout(() => handleSubmit({ preventDefault: () => {} } as React.FormEvent), 100);
                }}
              >
                Pricing
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="whitespace-nowrap text-xs"
                onClick={() => handleRequestCall()}
              >
                <Calendar size={12} className="mr-1" />
                Schedule Call
              </Button>
            </div>
          </div>
          
          {/* Input area */}
          <form onSubmit={handleSubmit} className="p-4 border-t flex items-center bg-white">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 mr-2"
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!message.trim() || isTyping}
            >
              {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChat;