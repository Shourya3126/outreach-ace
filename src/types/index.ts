export interface PsychologicalProfile {
  decision_authority: string;
  pain_points: string[];
  goals: string[];
  communication_preference: string;
}

export interface CommunicationStyle {
  formality: string;
  tone: string;
  vocabulary: string;
}

export interface ProfileAnalysis {
  name: string;
  company: string;
  role: string;
  industry: string;
  seniority: string;
  education: string[];
  certifications: string[];
  recent_activity: string[];
  psychological_profile: PsychologicalProfile;
  communication_style: CommunicationStyle;
  key_insights: string[];
  personalization_hooks: string[];
}

export interface EmailMessage {
  subject: string;
  body: string;
}

export interface MessageAnalysis {
  personalization_score: string;
  reasoning: string;
}

export interface GeneratedMessages {
  email: EmailMessage;
  linkedin: string;
  whatsapp: string;
  sms: string;
  instagram: string;
  analysis: MessageAnalysis;
}

export interface AnalyzeResponse {
  analysis: ProfileAnalysis;
  messages: GeneratedMessages;
}

export interface AnalyzeRequest {
  input_type: "url" | "file" | "text";
  data: string;
  offering: string;
  variant?: boolean;
}

export interface BatchRequest {
  urls: string[];
  offering: string;
}

export interface BatchResult {
  url: string;
  name: string;
  company: string;
  role: string;
  status: "Success" | "Partial" | "Failed";
  email_subject: string;
  email_body: string;
  linkedin_msg: string;
  whatsapp_msg: string;
  sms_msg: string;
  instagram_msg: string;
}

export interface KnowledgeProspect {
  id: string;
  name: string;
  company: string;
  industry: string;
  date_saved: string;
}

export interface AppSettings {
  apiUrl: string;
  offering: string;
}

export interface HealthResponse {
  status: string;
}
