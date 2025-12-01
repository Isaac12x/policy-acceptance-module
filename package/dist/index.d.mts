import React, { ReactNode } from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

type PolicyType = "terms" | "privacy" | "cookies" | "data-processing" | "security" | "custom";
type AcceptanceType = "individual" | "company";
type UserRole = "user" | "admin" | "legal" | "company-admin";
interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    companyId?: string;
    canAcceptForCompany?: boolean;
    isActive: boolean;
    createdAt: string;
    lastLoginAt?: string;
}
interface Company {
    id: string;
    name: string;
    domain?: string;
    adminUsers: string[];
    requiresCompanyAcceptance: boolean;
    allowIndividualAcceptance: boolean;
    settings: {
        requireAuthorityConfirmation: boolean;
        requireTitleAndEmail: boolean;
        allowDelegatedAcceptance: boolean;
        notificationEmails: string[];
    };
    createdAt: string;
    isActive: boolean;
}
interface PolicyVersion {
    id: string;
    version: string;
    date: string;
    content: string;
    changes?: string[];
    isBreaking?: boolean;
    deadline?: string;
    gracePeriodDays?: number;
    isActive: boolean;
    createdBy: string;
    approvedBy?: string;
    approvedAt?: string;
    metadata?: {
        wordCount: number;
        readingTimeMinutes: number;
        language: string;
        jurisdiction: string;
    };
}
interface CompanyInfo {
    companyName: string;
    acceptorName: string;
    acceptorTitle: string;
    acceptorEmail: string;
    acceptorUserId?: string;
    signatureMethod?: "click" | "typed" | "digital";
    ipAddress?: string;
    location?: string;
}
interface PolicyAcceptance {
    id: string;
    policyId: string;
    version: string;
    userId: string;
    acceptedAt: string;
    userAgent?: string;
    acceptanceType: AcceptanceType;
    companyInfo?: CompanyInfo;
    ipAddress?: string;
    location?: string;
    isValid: boolean;
    revokedAt?: string;
    revokedBy?: string;
    revokedReason?: string;
    metadata?: {
        sessionId?: string;
        deviceType?: string;
        browserInfo?: string;
    };
}
interface PolicyData {
    id: string;
    type: PolicyType;
    title: string;
    description?: string;
    versions: PolicyVersion[];
    currentVersion: string;
    userAcceptances: PolicyAcceptance[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    settings: {
        requiresAcceptance: boolean;
        allowVersionRollback: boolean;
        retentionPeriodDays: number;
        notificationSettings: {
            sendReminders: boolean;
            reminderDays: number[];
            escalationEmails: string[];
        };
    };
}
interface OrganizationSettings {
    requireCompanyAcceptance: boolean;
    allowIndividualAcceptance: boolean;
    requireAuthorityConfirmation: boolean;
    whoCanAcceptForCompany: "admins-only" | "designated-users" | "any-user";
    requireManagerApproval: boolean;
    acceptanceScope: "individual" | "company-wide" | "both";
    inheritanceRules: {
        newUsersInheritCompanyAcceptance: boolean;
        companyAcceptanceOverridesIndividual: boolean;
    };
    notifications: {
        enabled: boolean;
        reminderDays: number[];
        escalationChain: string[];
        sendToManagers: boolean;
    };
    auditSettings: {
        logAllActions: boolean;
        requireDigitalSignature: boolean;
        retentionPeriodYears: number;
        exportFormat: "json" | "csv" | "pdf";
    };
}
interface PolicyAcceptanceConfig {
    dataSource: {
        type: "local" | "api" | "hybrid";
        apiEndpoints?: {
            getPolicies?: string;
            getPolicy?: string;
            submitAcceptance?: string;
            getUserAcceptances?: string;
            getUsers?: string;
            getCompanies?: string;
            getOrganizationSettings?: string;
        };
        localData?: {
            policies?: PolicyData[];
            users?: User[];
            companies?: Company[];
            currentUser?: User;
        };
    };
    organization: OrganizationSettings;
    currentUser: User;
    currentCompany?: Company;
    ui: {
        theme?: {
            primaryColor?: string;
            borderRadius?: string;
            fontFamily?: string;
            darkMode?: boolean;
        };
        features: {
            showVersionHistory: boolean;
            showDiffComparison: boolean;
            showAcceptanceHistory: boolean;
            allowPolicyDownload: boolean;
            showDeadlineCountdown: boolean;
        };
        text: {
            customLabels?: Record<string, string>;
            supportedLanguages?: string[];
            defaultLanguage?: string;
        };
    };
    behavior: {
        autoShowOnLogin: boolean;
        blockAccessUntilAccepted: boolean;
        allowLaterReview: boolean;
        requireScrollToBottom: boolean;
        sessionTimeout?: number;
    };
    callbacks: {
        onAcceptance?: (acceptance: PolicyAcceptance) => void | Promise<void>;
        onDecline?: (policyId: string, reason?: string) => void | Promise<void>;
        onError?: (error: Error, context?: string) => void;
        onUserAction?: (action: string, data?: any) => void;
        beforeAcceptance?: (data: any) => boolean | Promise<boolean>;
    };
    integrations?: {
        analytics?: {
            trackAcceptance?: (data: any) => void;
            trackDecline?: (data: any) => void;
            trackView?: (data: any) => void;
        };
        notifications?: {
            sendEmail?: (to: string[], subject: string, body: string) => Promise<void>;
            sendSlack?: (channel: string, message: string) => Promise<void>;
        };
        audit?: {
            logAction?: (action: string, data: any) => Promise<void>;
        };
        ai?: AIAssistantConfig$1;
    };
}
interface PolicyAcceptanceContextType {
    policies: PolicyData[];
    currentPolicy: PolicyData | null;
    users: User[];
    companies: Company[];
    currentUser: User;
    currentCompany?: Company;
    isLoading: boolean;
    error: string | null;
    config: PolicyAcceptanceConfig;
    organizationSettings: OrganizationSettings;
    acceptPolicy: (policyId: string, version: string, acceptanceType: AcceptanceType, companyInfo?: CompanyInfo) => Promise<void>;
    declinePolicy: (policyId: string, reason?: string) => Promise<void>;
    refreshData: () => Promise<void>;
    canUserAcceptForCompany: (userId: string, companyId?: string) => boolean;
    getPolicyAcceptanceStatus: (policyId: string, userId?: string) => "accepted" | "pending" | "overdue" | "not-required";
    getRequiredPolicies: (userId?: string) => PolicyData[];
    getUserAcceptances: (userId?: string) => PolicyAcceptance[];
}
interface IndividualOnlyConfig extends Omit<PolicyAcceptanceConfig, "organization"> {
    organization: OrganizationSettings & {
        requireCompanyAcceptance: false;
        allowIndividualAcceptance: true;
        acceptanceScope: "individual";
    };
}
interface CompanyOnlyConfig extends Omit<PolicyAcceptanceConfig, "organization"> {
    organization: OrganizationSettings & {
        requireCompanyAcceptance: true;
        allowIndividualAcceptance: false;
        acceptanceScope: "company-wide";
    };
}
interface HybridConfig extends Omit<PolicyAcceptanceConfig, "organization"> {
    organization: OrganizationSettings & {
        requireCompanyAcceptance: boolean;
        allowIndividualAcceptance: boolean;
        acceptanceScope: "both";
    };
}
interface AIMessage$1 {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}
interface AIAssistantConfig$1 {
    onSendMessage: (message: string, history: AIMessage$1[]) => Promise<string>;
    assistantName?: string;
    assistantIcon?: React.ReactNode;
    placeholder?: string;
    welcomeMessage?: string;
    suggestedPrompts?: string[];
    brandColor?: string;
    allowMinimize?: boolean;
    persistChat?: boolean;
    maxMessages?: number;
}

declare const PolicyAcceptanceContext: React.Context<PolicyAcceptanceContextType | null>;
interface PolicyAcceptanceProviderProps {
    children: ReactNode;
    config: PolicyAcceptanceConfig;
}
declare const PolicyAcceptanceProvider: React.FC<PolicyAcceptanceProviderProps>;

declare const usePolicyAcceptance: () => PolicyAcceptanceContextType;

interface PolicyAcceptanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    policyId?: string;
    initialVersion?: string;
}
declare const PolicyAcceptanceModal: React.FC<PolicyAcceptanceModalProps>;

declare const PolicyVersioningDemo: React.FC;

interface AIMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}
interface AIAssistantConfig {
    onSendMessage: (message: string, history: AIMessage[]) => Promise<string>;
    assistantName?: string;
    assistantIcon?: string;
    placeholder?: string;
    welcomeMessage?: string;
    suggestedPrompts?: string[];
    brandColor?: string;
    allowMinimize?: boolean;
}
interface AIAssistantBarProps {
    config: AIAssistantConfig;
}
declare const AIAssistantBar: React.FC<AIAssistantBarProps>;

interface PolicyAcceptanceDashboardProps {
    policyId?: string;
    initialVersion?: string;
    onAcceptComplete?: () => void;
    aiAssistant?: AIAssistantConfig;
}
declare const PolicyAcceptanceDashboard: React.FC<PolicyAcceptanceDashboardProps>;

interface CompanyAcceptanceFormProps {
    acceptanceType: AcceptanceType;
    onAcceptanceTypeChange: (type: AcceptanceType) => void;
    companyInfo: CompanyInfo;
    onCompanyInfoChange: (info: CompanyInfo) => void;
    hasAuthority: boolean;
    onAuthorityChange: (hasAuthority: boolean) => void;
    isValid: boolean;
}
declare function CompanyAcceptanceForm({ acceptanceType, onAcceptanceTypeChange, companyInfo, onCompanyInfoChange, hasAuthority, onAuthorityChange, isValid, }: CompanyAcceptanceFormProps): react_jsx_runtime.JSX.Element;

interface PolicyDiffProps {
    currentVersion: PolicyVersion;
    previousVersion?: PolicyVersion;
}
declare function PolicyDiff({ currentVersion, previousVersion }: PolicyDiffProps): react_jsx_runtime.JSX.Element;

interface VersionHistoryProps {
    versions: PolicyVersion[];
    acceptances: PolicyAcceptance[];
    currentVersion: string;
    onViewVersion: (version: string) => void;
    onCompareVersions: (current: string, previous: string) => void;
    policyType?: PolicyType;
}
declare function VersionHistory({ versions, acceptances, currentVersion, onViewVersion, onCompareVersions, policyType, }: VersionHistoryProps): react_jsx_runtime.JSX.Element;

interface VersionBadgeProps {
    version: string;
    isAccepted?: boolean;
    isCurrent?: boolean;
    isBreaking?: boolean;
    className?: string;
}
declare function VersionBadge({ version, isAccepted, isCurrent, isBreaking, className }: VersionBadgeProps): react_jsx_runtime.JSX.Element;

interface DeadlineIndicatorProps {
    deadline: string;
    isAccepted?: boolean;
    className?: string;
}
declare function DeadlineIndicator({ deadline, isAccepted, className }: DeadlineIndicatorProps): react_jsx_runtime.JSX.Element;

declare const createPolicyData: (id: string, type: "terms" | "privacy" | "cookies" | "data-processing" | "security" | "custom", title: string, versions: PolicyVersion[], userAcceptances?: PolicyAcceptance[], settings?: Partial<PolicyData["settings"]>) => PolicyData;
declare const createUser: (id: string, email: string, name: string, role?: "user" | "admin" | "legal" | "company-admin", companyId?: string, canAcceptForCompany?: boolean) => User;
declare const createCompany: (id: string, name: string, adminUsers?: string[], settings?: Partial<Company["settings"]>) => Company;
declare const createIndividualOnlyConfig: (currentUser: User, overrides?: Partial<PolicyAcceptanceConfig>) => PolicyAcceptanceConfig;
declare const createCompanyOnlyConfig: (currentUser: User, currentCompany: Company, overrides?: Partial<PolicyAcceptanceConfig>) => PolicyAcceptanceConfig;
declare const createHybridConfig: (currentUser: User, currentCompany: Company, overrides?: Partial<PolicyAcceptanceConfig>) => PolicyAcceptanceConfig;
declare const validatePolicyVersion: (version: PolicyVersion) => boolean;
declare const validateUser: (user: User) => boolean;
declare const validateCompany: (company: Company) => boolean;
declare const canUserAcceptForCompany: (user: User, company: Company, organizationSettings: OrganizationSettings) => boolean;
declare const getPolicyAcceptanceStatus: (policy: PolicyData, user: User, organizationSettings: OrganizationSettings) => "accepted" | "pending" | "overdue" | "not-required";
declare const getRequiredPolicies: (policies: PolicyData[], user: User, organizationSettings: OrganizationSettings) => PolicyData[];
declare const getUserAcceptances: (policies: PolicyData[], userId: string) => PolicyAcceptance[];
declare const formatAcceptanceDate: (dateString: string) => string;
declare const calculateDaysUntilDeadline: (deadline: string) => number;
declare const isVersionOverdue: (deadline?: string) => boolean;
declare const getPolicyTypeInfo: (type: PolicyData["type"]) => {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
};
declare const generateSamplePolicies: () => PolicyData[];
declare const generateSampleUsers: () => User[];
declare const generateSampleCompanies: () => Company[];
declare const compareVersions: (v1: string, v2: string) => number;
declare const canAcceptVersion: (policy: PolicyData, version: string, userId: string) => {
    canAccept: boolean;
    reason?: string;
    missingVersion?: string;
};

export { AIAssistantBar, type AIAssistantConfig$1 as AIAssistantConfig, type AIMessage$1 as AIMessage, type AcceptanceType, type Company, CompanyAcceptanceForm, type CompanyInfo, type CompanyOnlyConfig, DeadlineIndicator, type HybridConfig, type IndividualOnlyConfig, type OrganizationSettings, type PolicyAcceptance, type PolicyAcceptanceConfig, PolicyAcceptanceContext, type PolicyAcceptanceContextType, PolicyAcceptanceDashboard, PolicyAcceptanceModal, PolicyAcceptanceProvider, type PolicyData, PolicyDiff, type PolicyType, type PolicyVersion, PolicyVersioningDemo, type User, type UserRole, VersionBadge, VersionHistory, calculateDaysUntilDeadline, canAcceptVersion, canUserAcceptForCompany, compareVersions, createCompany, createCompanyOnlyConfig, createHybridConfig, createIndividualOnlyConfig, createPolicyData, createUser, formatAcceptanceDate, generateSampleCompanies, generateSamplePolicies, generateSampleUsers, getPolicyAcceptanceStatus, getPolicyTypeInfo, getRequiredPolicies, getUserAcceptances, isVersionOverdue, usePolicyAcceptance, validateCompany, validatePolicyVersion, validateUser };
