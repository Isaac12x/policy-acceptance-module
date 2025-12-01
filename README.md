# Policy Acceptance Module

A comprehensive, drop-in React package for managing policy acceptances in Next.js applications with support for individual, company-wide, and hybrid acceptance workflows.

## Features

- **Multiple Display Modes**: Modal popup or full dashboard view
- **Flexible Organization Models**: Individual-only, company-only, or hybrid acceptance
- **Version Management**: Track multiple policy versions with diff viewing
- **Deadline Support**: Set and track acceptance deadlines
- **AI Assistant Integration**: Optional AI helper for policy questions (plug-and-play)
- **TypeScript Support**: Full type safety and IntelliSense
- **Customizable**: Extensive configuration options for branding and behavior

## Goal

This package has been made to provide a standard for a legal hub in react applications.
Most legal acceptances are done very poorly and providing an expected standard users are accostumed to has many benefits.

### Recommended flow

The expected flow is such as:

1. Normal policy reading on a default webpage or blog-style interface
2. For new acceptances;
   1. if within your app, use the pop-up module acceptance with a link to the dashboard acceptance.
   2. if opened via email or otherwise, send them directly to the dashboard acceptance.

We also provide a UI for adding AI responses. Althought the training of AI via RAG or direct feeding would fall on the end user (you).
You can read more about the features it has in the features section.

## Get started

Run the following command and install as you would any normal npm package (for the example we use npm for standardisation but you can use any package manager.)

```bash
npm install @fortisvincere/policy-acceptance-module
```

## Quick Start

```tsx
import {
  PolicyAcceptanceProvider,
  PolicyAcceptanceModal,
  createIndividualOnlyConfig,
  createUser,
  generateSamplePolicies,
} from "@fortisvincere/policy-acceptance-module";

// Create your configuration
const user = createUser("user-id", "email@example.com", "User Name", "user");
const policies = generateSamplePolicies(); // Or load from your API

const config = createIndividualOnlyConfig(user, {
  dataSource: {
    type: "api",
    endpoints: {
      getPolicies: "/api/policies",
      acceptPolicy: "/api/policies/accept",
      // ... other endpoints
    },
  },
  callbacks: {
    onAcceptance: (acceptance) => {
      console.log("Policy accepted:", acceptance);
    },
  },
});

// Use in your app
function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <PolicyAcceptanceProvider config={config}>
      <YourApp />
      <PolicyAcceptanceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </PolicyAcceptanceProvider>
  );
}
```

## Display Modes

### Modal Popup

Best for interrupt-based flows where immediate attention is required:

```tsx
import { PolicyAcceptanceModal } from "@fortisvincere/policy-acceptance-module";

<PolicyAcceptanceModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  policyId="optional-specific-policy-id"
/>;
```

### Dashboard View

Best for settings pages or dedicated policy management areas:

```tsx
import { PolicyAcceptanceDashboard } from "@fortisvincere/policy-acceptance-module";

<PolicyAcceptanceDashboard
  aiAssistant={aiConfig} // Optional AI helper
/>;
```

## Organization Models

### Individual Only

Users accept policies for themselves:

```tsx
import { createIndividualOnlyConfig } from "@fortisvincere/policy-acceptance-module";

const config = createIndividualOnlyConfig(user, options);
```

### Company Only

Designated admins accept for entire organization:

```tsx
import { createCompanyOnlyConfig } from "@fortisvincere/policy-acceptance-module";

const config = createCompanyOnlyConfig(user, company, options);
```

### Hybrid Model

Supports both individual and company acceptance:

```tsx
import { createHybridConfig } from "@fortisvincere/policy-acceptance-module";

const config = createHybridConfig(user, company, options);
```

## AI Assistant Integration

Add an optional AI helper for policy questions:

```tsx
const aiAssistant = {
  onSendMessage: async (message, history) => {
    // Connect to your AI service (OpenAI, Anthropic, etc.)
    const response = await yourAIService.chat(message, history);
    return response;
  },
  assistantName: "Legal Assistant",
  welcomeMessage: "How can I help with policy questions?",
  suggestedPrompts: [
    "Explain the privacy policy",
    "What changed in the latest version?",
  ],
};

<PolicyAcceptanceDashboard aiAssistant={aiAssistant} />;
```

## Demo

See the `examples/` directory for complete working examples of all features.

Look at the examples/ folder for examples on how to set this in a dashboard style and modal style.

Run the demo:

```bash
npm run dev
```

Then visit:

- `/` - Choose display mode
- `/demo/modal` - Modal demonstration
- `/demo/dashboard` - Dashboard with AI assistant

## Documentation

- [Policy Diff Component](./docs/policy-diff.md) - Understanding version comparison
- [AI Assistant Integration](./docs/ai-assistant-integration.md) - Connecting your AI service
- [Examples](./example/components/README.md) - Complete working examples

## Package Structure

```
policy-acceptance-module/
├── components/ # React components (modal, dashboard, etc.)
├── hooks/ # React hooks (usePolicyAcceptance, etc.)
├── provider/ # Context provider
├── types/ # TypeScript type definitions
├── utils/ # Helper functions and configuration
├── index.ts # Main package entry point
├── example/ # Demo implementations (not included in npm package)
└── docs/ # Documentation
```

## Building for Production

```bash
npm run build
```

The package is built using `tsup` and outputs:

- ESM bundle for modern bundlers
- Type definitions for TypeScript
- Minified production builds

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

Please read the license file for specific legal terms. In summary you can expect the following:

```
- Free to use for individuals.
- Free to use for starters.
- Free to use for startups up to 25 people or 10M in revenue.
- License required for mid and large companies.
```

For licensing enquiries, email at licensing@fortisvincere.com.
For any questions, email at questions@fortsivincere.com

## Misc

- Made by Isaac AR, @IsaacAlbets
- IP & management assigned to Fortis & Vincere
