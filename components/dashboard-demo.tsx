"use client";

import {
  PolicyAcceptanceDashboard,
  PolicyAcceptanceProvider,
} from "@fortisvincere/policy-acceptance-module";
import type { AIAssistantConfig } from "@fortisvincere/policy-acceptance-module";
import { createIndividualConfig } from "./organization-setups";

const mockAIAssistant: AIAssistantConfig = {
  onSendMessage: async (message: string, history: any[]) => {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple mock responses - replace with actual AI integration
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("privacy") || lowerMessage.includes("data")) {
      return "Our Privacy Policy outlines how we collect, use, and protect your personal data. The latest version includes enhanced GDPR compliance measures and clarified data retention policies. Would you like me to highlight the key changes?";
    }

    if (lowerMessage.includes("terms") || lowerMessage.includes("service")) {
      return "The Terms of Service define the rules and regulations for using our platform. Recent updates include clearer payment terms and expanded user rights. Is there a specific section you'd like to know more about?";
    }

    if (lowerMessage.includes("accept") || lowerMessage.includes("who needs")) {
      return "Policy acceptance requirements depend on your organization setup. Individual users accept for themselves, while company admins can accept on behalf of the entire organization. Would you like to know more about your specific situation?";
    }

    if (lowerMessage.includes("changes") || lowerMessage.includes("new")) {
      return "The latest policy updates include:\n• Enhanced data protection measures\n• Clarified user rights and responsibilities\n• Updated compliance requirements\n• Improved transparency in data handling\n\nWould you like details on any specific change?";
    }

    if (lowerMessage.includes("deadline") || lowerMessage.includes("when")) {
      return "Some policies have acceptance deadlines to ensure compliance. You can see deadline information at the top of each policy. Need help prioritizing which policies to review first?";
    }

    return "I can help you understand our policies, explain recent changes, and answer questions about acceptance requirements. What would you like to know?";
  },
  assistantName: "Legal Assistant",
  placeholder: "Ask about policies, terms, or compliance...",
  welcomeMessage:
    "👋 Hello! I'm here to help you understand our policies and answer any questions you may have. What would you like to know?",
  suggestedPrompts: [
    "Explain the privacy policy",
    "What changed in the latest version?",
    "Who needs to accept policies?",
    "When is the acceptance deadline?",
  ],
  brandColor: "hsl(221.2 83.2% 53.3%)",
  allowMinimize: true,
};

export function DashboardDemo() {
  const config = createIndividualConfig();

  return (
    <PolicyAcceptanceProvider config={config}>
      <PolicyAcceptanceDashboard legalHubUrl="https://legal-hub.example.com/viewer" />
    </PolicyAcceptanceProvider>
  );
}
