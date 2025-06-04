import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, BarChart, Users, Check } from 'lucide-react';
import Footer from '@/components/Landing/Footer';
import Navbar from '@/components/Landing/Navbar';
import HeroAnimation from '@/components/Landing/HeroAnimation';
import Testimonials from '@/components/Landing/Testimonials';
import DemoCallModal from '@/components/Landing/DemoCallModal';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  
  const features = [
    {
      icon: <Phone size={32} className="text-indigo-500" />,
      title: "AI Voice Technology",
      description: "Natural-sounding AI voices with intelligent conversation capabilities powered by advanced TTS and STT."
    },
    {
      icon: <MessageSquare size={32} className="text-indigo-500" />,
      title: "Real-Time Conversations",
      description: "Our AI listens, understands, and responds naturally in real-time using cutting-edge language models."
    },
    {
      icon: <BarChart size={32} className="text-indigo-500" />,
      title: "Campaign Management",
      description: "Create, schedule, and optimize your calling campaigns with detailed analytics and reporting."
    },
    {
      icon: <Users size={32} className="text-indigo-500" />,
      title: "Built-in CRM",
      description: "Manage contacts, track interactions, and store conversation history in one integrated platform."
    }
  ];

  const useCases = [
    {
      title: "Sales Outreach",
      description: "Automate prospecting calls and follow-ups at scale",
      image: "/sales-outreach.jpg"
    },
    {
      title: "Appointment Reminders",
      description: "Reduce no-shows with automated confirmation calls",
      image: "/appointment-reminder.jpg"
    },
    {
      title: "Customer Surveys",
      description: "Collect feedback through natural voice conversations",
      image: "/customer-survey.jpg"
    },
    {
      title: "Lead Qualification",
      description: "Pre-qualify leads before routing to sales teams",
      image: "/lead-qualification.jpg"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="gradient-bg text-white">
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI-Powered Voice Calling <span className="text-yellow-300">That Works</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Automate your outbound calls with our advanced AI voice technology. 
              Natural conversations that convert leads into customers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-white text-indigo-700 hover:bg-gray-100 font-semibold"
                onClick={() => navigate('/dashboard')}
              >
                Get Started Free
              </Button>
              <Button 
                size="lg"
                className="border-2 border-white text-white bg-indigo-600 hover:bg-indigo-700 font-semibold"
                onClick={() => setIsDemoModalOpen(true)}
              >
                Try Demo Call
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <HeroAnimation />
          </div>
        </div>
      </div>
      
      {/* Trusted By Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-xl text-gray-600 mb-8">Trusted by innovative companies</h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-70">
            <img src="/company-logo1.svg" alt="Company 1" className="h-8" />
            <img src="/company-logo2.svg" alt="Company 2" className="h-8" />
            <img src="/company-logo3.svg" alt="Company 3" className="h-8" />
            <img src="/company-logo4.svg" alt="Company 4" className="h-8" />
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to automate your calling operations with AI
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-4 bg-indigo-50 rounded-full inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Use Cases Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Use Cases</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how AI Voice Caller is transforming business communications
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow group">
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img 
                    src={useCase.image} 
                    alt={useCase.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
                  <p className="text-gray-600">{useCase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform is designed to be simple, yet powerful
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xl mr-4">1</div>
                <h3 className="text-xl font-bold">Create your campaign</h3>
              </div>
              <p className="text-gray-600 mb-4 pl-16">
                Upload your contact list, define your script, and set your campaign goals.
              </p>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xl mr-4">2</div>
                <h3 className="text-xl font-bold">Configure your AI voice</h3>
              </div>
              <p className="text-gray-600 mb-4 pl-16">
                Choose from multiple natural-sounding voices and customize the tone and personality.
              </p>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xl mr-4">3</div>
                <h3 className="text-xl font-bold">Launch and monitor</h3>
              </div>
              <p className="text-gray-600 mb-4 pl-16">
                Start your campaign and track performance in real-time with detailed analytics.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* CTA Section */}
      <div className="gradient-bg text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your calling operations?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Join thousands of businesses using our AI Voice Caller to increase efficiency and drive more conversions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-indigo-700 hover:bg-gray-100 font-semibold"
              onClick={() => navigate('/dashboard')}
            >
              Start Your Free Trial
            </Button>
            <Button 
              size="lg"
              className="border-2 border-white text-white bg-indigo-600 hover:bg-indigo-700 font-semibold"
              onClick={() => navigate('/pricing')}
            >
              View Pricing
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* Demo Call Modal */}
      <DemoCallModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
};

export default LandingPage;