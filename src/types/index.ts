// Define all types here

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  callLimit: number;
  isPopular?: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt?: string;
  description?: string;
  scriptId?: string;
  callsMade?: number;
  callsAnswered?: number;
  avgCallDuration?: number;
  script?: string;
}

export interface Call {
  id: string;
  campaignId: string;
  contactName?: string;
  contactPhone?: string;
  contactId?: string;
  status: 'planned' | 'in-progress' | 'completed' | 'failed' | 'no-answer' | 'transferred';
  startTime?: string;
  endTime?: string;
  duration?: number;
  recordingUrl?: string;
  transcriptUrl?: string;
  transcript?: string;
  notes?: string;
}

// Call status types for different contexts
export type CallStatus = 'idle' | 'calling' | 'connected' | 'completed';
export type DatabaseCallStatus = 'pending' | 'calling' | 'connected' | 'completed' | 'failed';