# Policy Acceptance Module - Demo Examples

This directory contains demonstration examples showing how to use the policy acceptance package in different scenarios.

## Demo Structure

All demo components import from the published package (`@fortisvincere/policy-acceptance-module`) to simulate how external projects would consume this package. This ensures the demos accurately reflect real-world usage after installing the library from npm (or via a local file dependency during development).

### Available Demos

1. **Organization Setups Demo** (`organization-setups.tsx`)

   - Shows three organizational models: Individual, Company, and Hybrid
   - Demonstrates configuration helpers and setup patterns
   - Provides interactive examples for each model

2. **Modal Demo** (`modal-demo.tsx`)

   - Demonstrates popup/modal display mode
   - Shows policy cards that trigger acceptance modals
   - Best for interrupt-based policy acceptance flows

3. **Dashboard Demo** (`dashboard-demo.tsx`)
   - Demonstrates full-page dashboard display mode
   - Includes AI assistant integration example
   - Best for settings pages or dedicated policy management areas

## Usage in Your Project

These demos show how to integrate the policy acceptance package into a Next.js application. To use the package in your own project:

```tsx
// Import from the package
import {
  PolicyAcceptanceProvider,
  PolicyAcceptanceModal,
  PolicyAcceptanceDashboard,
  createIndividualOnlyConfig,
  createUser,
  generateSamplePolicies,
} from "@fortisvincere/policy-acceptance-module";

// Create configuration
const user = createUser("user-id", "email@example.com", "User Name", "user");
const policies = generateSamplePolicies();

const config = createIndividualOnlyConfig(user, {
  dataSource: {
    type: "local",
    localData: {
      policies,
      users: [user],
      companies: [],
      currentUser: user,
    },
  },
});

// Use in your app
function App() {
  return (
    <PolicyAcceptanceProvider config={config}>
      {/* Your app content */}
      <PolicyAcceptanceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </PolicyAcceptanceProvider>
  );
}
```

## Running the Demos

The demos are accessible at:

- Homepage: `/` - Choose between modal and dashboard demos
- Modal Demo: `/demo/modal` - Interactive modal demonstration
- Dashboard Demo: `/demo/dashboard` - Full dashboard with AI assistant

## Example Configurations

### Individual Only

Best for: Freelancers, consultants, personal accounts

- Users accept policies for themselves only
- No company authority required
- Simple compliance tracking

### Company Only

Best for: Enterprises, corporations, regulated industries

- Designated users accept on behalf of organization
- Authority confirmation required
- Organizational compliance tracking

### Hybrid Model

Best for: Mixed organizations, subsidiaries, flexible teams

- Supports both individual and company acceptance
- Role-based permissions
- Complex organizational structures

## Sample Data

The examples use `generateSamplePolicies()` which creates:

- Multiple policy types (Terms, Privacy, Cookie, Data Processing, Security)
- Multiple versions with acceptance history
- Mix of overdue and active deadlines
- Various acceptance states (accepted, pending, blocked)

You can customize this data or replace it with your own policy data structure.

## Key Differences from Production

- **Data Source**: Demos use local/mock data. Production should connect to your API.
- **AI Assistant**: Dashboard demo uses mock responses. Integrate your actual AI service.
- **Styling**: Demos use demo-specific styling. Customize to match your brand.
