# AI Assistant Integration Guide

The Policy Acceptance module includes a customizable AI assistant bar that can be integrated with any company's AI system.

## Overview

The AI assistant provides contextual help to users reviewing policies, answering questions about terms, changes, deadlines, and acceptance requirements.

## Features

- **Multiple View States**: Minimized icon, collapsed bar, expanded chat, fullscreen mode
- **Customizable Branding**: Configure colors, positioning, and messaging
- **Plug-and-Play Integration**: Works with any AI backend (OpenAI, Anthropic, custom models)
- **Smart Suggestions**: Predefined prompts to guide users
- **Persistent Chat**: Maintains conversation history during the session

## Basic Usage

```tsx
import {
  PolicyAcceptanceDashboard,
  type AIAssistantConfig,
  type AIMessage,
} from "@fortisvincere/policy-acceptance-module";

// Configure your AI assistant
const aiConfig: AIAssistantConfig = {
  onSendMessage: async (message: string, history: AIMessage[]) => {
    // Connect to your AI system
    const response = await yourAIService.chat({
      message,
      history,
      context: 'legal-policies'
    })
    return response.text
  },
  assistantName: "Legal Assistant",
  placeholder: "Ask about our policies...",
  welcomeMessage: "Hello! How can I help you understand our policies?",
  brandColor: "hsl(221.2 83.2% 53.3%)",
  position: "bottom-right"
}

// Use in dashboard
<PolicyAcceptanceDashboard aiAssistant={aiConfig} />
```

## Configuration Options

### Required

- **`onSendMessage`**: Function that handles message sending to your AI system
  - Parameters: `message` (string), `history` (AIMessage[])
  - Returns: Promise<string> with AI response

### Optional Customization

- **`assistantName`**: Display name (default: "Legal Assistant")
- **`placeholder`**: Input placeholder text
- **`welcomeMessage`**: Initial greeting message
- **`suggestedPrompts`**: Array of suggested questions
- **`brandColor`**: Primary color in HSL format
- **`position`**: "bottom-left" | "bottom-right"
- **`allowMinimize`**: Enable minimize functionality
- **`persistChat`**: Save chat history across sessions
- **`maxMessages`**: Limit conversation history

## Integration Examples

### OpenAI Integration

```tsx
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const aiConfig: AIAssistantConfig = {
  onSendMessage: async (message, history) => {
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful legal assistant explaining company policies.",
      },
      ...history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
    });

    return response.choices[0].message.content || "";
  },
};
```

### Anthropic Integration

```tsx
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const aiConfig: AIAssistantConfig = {
  onSendMessage: async (message, history) => {
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [
        ...history.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: "user", content: message },
      ],
    });

    return response.content[0].text;
  },
};
```

### Custom AI Backend

```tsx
const aiConfig: AIAssistantConfig = {
  onSendMessage: async (message, history) => {
    const response = await fetch("/api/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
    });

    const data = await response.json();
    return data.response;
  },
};
```

## Best Practices

1. **Context Awareness**: Provide policy-specific context to your AI
2. **Error Handling**: Implement fallback responses for API failures
3. **Rate Limiting**: Protect your AI endpoints from abuse
4. **Privacy**: Don't send sensitive user data to AI services
5. **Caching**: Cache common questions for faster responses

## Styling

The assistant inherits your app's theme but can be customized:

```tsx
const aiConfig: AIAssistantConfig = {
  // ... other config
  brandColor: "hsl(221.2 83.2% 53.3%)", // Matches your brand
  position: "bottom-right", // Or "bottom-left"
};
```

## Advanced Features

### Suggested Prompts

Guide users with pre-written questions:

```tsx
suggestedPrompts: [
  "What changed in version 3.0?",
  "Do I need to accept as individual or company?",
  "Explain the data retention policy",
  "When is the acceptance deadline?",
];
```

### Persistent Chat

Enable chat history across page reloads:

```tsx
persistChat: true; // Saves to localStorage
```

### Analytics Integration

Track AI usage:

```tsx
onSendMessage: async (message, history) => {
  // Track analytics
  analytics.track("ai_question_asked", {
    question: message,
    context: "policy_review",
  });

  const response = await yourAI.chat(message, history);
  return response;
};
```

## Troubleshooting

- **Assistant not appearing**: Ensure `aiAssistant` prop is passed to dashboard
- **Messages not sending**: Check `onSendMessage` function and API keys
- **Styling issues**: Verify `brandColor` uses HSL format
- **Performance**: Implement debouncing for rapid messages

## Support

For issues or questions about AI assistant integration, please refer to the main README or open an issue on GitHub.
