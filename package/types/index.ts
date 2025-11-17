import type React from "react"
export type PolicyType = "terms" | "privacy" | "cookies" | "data-processing" | "security" | "custom"
export type AcceptanceType = "individual" | "company"
export type UserRole = "user" | "admin" | "legal" | "company-admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  companyId?: string
  canAcceptForCompany?: boolean
  isActive: boolean
  createdAt: string
  lastLoginAt?: string
}

export interface Company {
  id: string
  name: string
  domain?: string
  adminUsers: string[] // User IDs who can accept for company
  requiresCompanyAcceptance: boolean
  allowIndividualAcceptance: boolean
  settings: {
    requireAuthorityConfirmation: boolean
    requireTitleAndEmail: boolean
    allowDelegatedAcceptance: boolean
    notificationEmails: string[]
  }
  createdAt: string
  isActive: boolean
}

export interface PolicyVersion {
  id: string
  version: string
  date: string
  content: string
  changes?: string[]
  isBreaking?: boolean
  deadline?: string
  gracePeriodDays?: number
  isActive: boolean
  createdBy: string
  approvedBy?: string
  approvedAt?: string
  metadata?: {
    wordCount: number
    readingTimeMinutes: number
    language: string
    jurisdiction: string
  }
}

export interface CompanyInfo {
  companyName: string
  acceptorName: string
  acceptorTitle: string
  acceptorEmail: string
  acceptorUserId?: string
  signatureMethod?: "click" | "typed" | "digital"
  ipAddress?: string
  location?: string
}

export interface PolicyAcceptance {
  id: string
  policyId: string
  version: string
  userId: string
  acceptedAt: string
  userAgent?: string
  acceptanceType: AcceptanceType
  companyInfo?: CompanyInfo
  ipAddress?: string
  location?: string
  isValid: boolean
  revokedAt?: string
  revokedBy?: string
  revokedReason?: string
  metadata?: {
    sessionId?: string
    deviceType?: string
    browserInfo?: string
  }
}

export interface PolicyData {
  id: string
  type: PolicyType
  title: string
  description?: string
  versions: PolicyVersion[]
  currentVersion: string
  userAcceptances: PolicyAcceptance[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  settings: {
    requiresAcceptance: boolean
    allowVersionRollback: boolean
    retentionPeriodDays: number
    notificationSettings: {
      sendReminders: boolean
      reminderDays: number[]
      escalationEmails: string[]
    }
  }
}

export interface OrganizationSettings {
  // Company acceptance requirements
  requireCompanyAcceptance: boolean
  allowIndividualAcceptance: boolean
  requireAuthorityConfirmation: boolean

  // User permissions
  whoCanAcceptForCompany: "admins-only" | "designated-users" | "any-user"
  requireManagerApproval: boolean

  // Acceptance behavior
  acceptanceScope: "individual" | "company-wide" | "both"
  inheritanceRules: {
    newUsersInheritCompanyAcceptance: boolean
    companyAcceptanceOverridesIndividual: boolean
  }

  // Notifications and reminders
  notifications: {
    enabled: boolean
    reminderDays: number[]
    escalationChain: string[]
    sendToManagers: boolean
  }

  // Compliance and audit
  auditSettings: {
    logAllActions: boolean
    requireDigitalSignature: boolean
    retentionPeriodYears: number
    exportFormat: "json" | "csv" | "pdf"
  }
}

export interface PolicyAcceptanceConfig {
  // Data sources
  dataSource: {
    type: "local" | "api" | "hybrid"
    apiEndpoints?: {
      getPolicies?: string
      getPolicy?: string
      submitAcceptance?: string
      getUserAcceptances?: string
      getUsers?: string
      getCompanies?: string
      getOrganizationSettings?: string
    }
    localData?: {
      policies?: PolicyData[]
      users?: User[]
      companies?: Company[]
      currentUser?: User
    }
  }

  // Organization settings
  organization: OrganizationSettings

  // Current user context
  currentUser: User
  currentCompany?: Company

  // UI customization
  ui: {
    theme?: {
      primaryColor?: string
      borderRadius?: string
      fontFamily?: string
      darkMode?: boolean
    }
    features: {
      showVersionHistory: boolean
      showDiffComparison: boolean
      showAcceptanceHistory: boolean
      allowPolicyDownload: boolean
      showDeadlineCountdown: boolean
    }
    text: {
      customLabels?: Record<string, string>
      supportedLanguages?: string[]
      defaultLanguage?: string
    }
  }

  // Behavior settings
  behavior: {
    autoShowOnLogin: boolean
    blockAccessUntilAccepted: boolean
    allowLaterReview: boolean
    requireScrollToBottom: boolean
    sessionTimeout?: number
  }

  // Callbacks
  callbacks: {
    onAcceptance?: (acceptance: PolicyAcceptance) => void | Promise<void>
    onDecline?: (policyId: string, reason?: string) => void | Promise<void>
    onError?: (error: Error, context?: string) => void
    onUserAction?: (action: string, data?: any) => void
    beforeAcceptance?: (data: any) => boolean | Promise<boolean>
  }

  // Integration hooks
  integrations?: {
    analytics?: {
      trackAcceptance?: (data: any) => void
      trackDecline?: (data: any) => void
      trackView?: (data: any) => void
    }
    notifications?: {
      sendEmail?: (to: string[], subject: string, body: string) => Promise<void>
      sendSlack?: (channel: string, message: string) => Promise<void>
    }
    audit?: {
      logAction?: (action: string, data: any) => Promise<void>
    }
    ai?: AIAssistantConfig
  }
}

export interface PolicyAcceptanceContextType {
  // Data
  policies: PolicyData[]
  currentPolicy: PolicyData | null
  users: User[]
  companies: Company[]
  currentUser: User
  currentCompany?: Company

  // State
  isLoading: boolean
  error: string | null

  // Configuration
  config: PolicyAcceptanceConfig
  organizationSettings: OrganizationSettings

  // Actions
  acceptPolicy: (
    policyId: string,
    version: string,
    acceptanceType: AcceptanceType,
    companyInfo?: CompanyInfo,
  ) => Promise<void>
  declinePolicy: (policyId: string, reason?: string) => Promise<void>
  refreshData: () => Promise<void>

  // Utilities
  canUserAcceptForCompany: (userId: string, companyId?: string) => boolean
  getPolicyAcceptanceStatus: (policyId: string, userId?: string) => "accepted" | "pending" | "overdue" | "not-required"
  getRequiredPolicies: (userId?: string) => PolicyData[]
  getUserAcceptances: (userId?: string) => PolicyAcceptance[]
}

// Helper types for different organizational setups
export interface IndividualOnlyConfig extends Omit<PolicyAcceptanceConfig, "organization"> {
  organization: OrganizationSettings & {
    requireCompanyAcceptance: false
    allowIndividualAcceptance: true
    acceptanceScope: "individual"
  }
}

export interface CompanyOnlyConfig extends Omit<PolicyAcceptanceConfig, "organization"> {
  organization: OrganizationSettings & {
    requireCompanyAcceptance: true
    allowIndividualAcceptance: false
    acceptanceScope: "company-wide"
  }
}

export interface HybridConfig extends Omit<PolicyAcceptanceConfig, "organization"> {
  organization: OrganizationSettings & {
    requireCompanyAcceptance: boolean
    allowIndividualAcceptance: boolean
    acceptanceScope: "both"
  }
}

// AI assistant types
export interface AIMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface AIAssistantConfig {
  // Required: AI integration
  onSendMessage: (message: string, history: AIMessage[]) => Promise<string>

  // Optional: Customization
  assistantName?: string
  assistantIcon?: React.ReactNode
  placeholder?: string
  welcomeMessage?: string
  suggestedPrompts?: string[]

  // Optional: Styling
  brandColor?: string

  // Optional: Behavior
  allowMinimize?: boolean
  persistChat?: boolean
  maxMessages?: number
}
