// Main exports
export {
  PolicyAcceptanceProvider,
  PolicyAcceptanceContext,
} from "./provider/policy-acceptance-provider";
export { usePolicyAcceptance } from "./hooks/use-policy-acceptance";

// Component exports
export { PolicyAcceptanceModal } from "./components/policy-acceptance-modal";
export { PolicyVersioningDemo } from "./components/policy-versioning-demo";
export { PolicyAcceptanceDashboard } from "./components/policy-acceptance-dashboard";
export { CompanyAcceptanceForm } from "./components/company-acceptance-form";
export { PolicyDiff } from "./components/policy-diff";
export { VersionHistory } from "./components/version-history";
export { VersionBadge } from "./components/version-badge";
export { DeadlineIndicator } from "./components/deadline-indicator";
export { AIAssistantBar } from "./components/ai-assistant-bar";

// Type exports
export type {
  PolicyType,
  AcceptanceType,
  UserRole,
  User,
  Company,
  PolicyVersion,
  CompanyInfo,
  PolicyAcceptance,
  PolicyData,
  OrganizationSettings,
  PolicyAcceptanceConfig,
  PolicyAcceptanceContextType,
  IndividualOnlyConfig,
  CompanyOnlyConfig,
  HybridConfig,
  AIMessage,
  AIAssistantConfig,
} from "./types/index";

// Utility exports
export {
  createPolicyData,
  createUser,
  createCompany,
  createIndividualOnlyConfig,
  createCompanyOnlyConfig,
  createHybridConfig,
  validatePolicyVersion,
  validateUser,
  validateCompany,
  canUserAcceptForCompany,
  getPolicyAcceptanceStatus,
  getRequiredPolicies,
  getUserAcceptances,
  formatAcceptanceDate,
  calculateDaysUntilDeadline,
  isVersionOverdue,
  getPolicyTypeInfo,
  generateSamplePolicies,
  generateSampleUsers,
  generateSampleCompanies,
  compareVersions,
  canAcceptVersion,
} from "./utils/index";

// // Example/Demo exports
// export { ModalDemo } from "./examples/modal-demo"
// export { OrganizationSetupsDemo } from "./examples/organization-setups"
// export { DashboardDemo } from "./examples/dashboard-demo"
