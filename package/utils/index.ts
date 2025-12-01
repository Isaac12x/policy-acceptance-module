import type {
  PolicyData,
  PolicyVersion,
  PolicyAcceptance,
  User,
  Company,
  OrganizationSettings,
  PolicyAcceptanceConfig,
} from "../types";

// Policy data creation and validation
export const createPolicyData = (
  id: string,
  type:
    | "terms"
    | "privacy"
    | "cookies"
    | "data-processing"
    | "security"
    | "custom",
  title: string,
  versions: PolicyVersion[],
  userAcceptances: PolicyAcceptance[] = [],
  settings?: Partial<PolicyData["settings"]>
): PolicyData => {
  const sortedVersions = versions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return {
    id,
    type,
    title,
    versions: sortedVersions,
    currentVersion: sortedVersions[0]?.version || "1.0",
    userAcceptances,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: {
      requiresAcceptance: true,
      allowVersionRollback: false,
      retentionPeriodDays: 2555, // 7 years
      notificationSettings: {
        sendReminders: true,
        reminderDays: [7, 3, 1],
        escalationEmails: [],
      },
      ...settings,
    },
  };
};

export const createUser = (
  id: string,
  email: string,
  name: string,
  role: "user" | "admin" | "legal" | "company-admin" = "user",
  companyId?: string,
  canAcceptForCompany = false
): User => ({
  id,
  email,
  name,
  role,
  companyId,
  canAcceptForCompany,
  isActive: true,
  createdAt: new Date().toISOString(),
});

export const createCompany = (
  id: string,
  name: string,
  adminUsers: string[] = [],
  settings?: Partial<Company["settings"]>
): Company => ({
  id,
  name,
  adminUsers,
  requiresCompanyAcceptance: true,
  allowIndividualAcceptance: false,
  settings: {
    requireAuthorityConfirmation: true,
    requireTitleAndEmail: true,
    allowDelegatedAcceptance: false,
    notificationEmails: [],
    ...settings,
  },
  createdAt: new Date().toISOString(),
  isActive: true,
});

// Configuration presets for different organizational setups
export const createIndividualOnlyConfig = (
  currentUser: User,
  overrides?: Partial<PolicyAcceptanceConfig>
): PolicyAcceptanceConfig => ({
  dataSource: {
    type: "local",
    localData: {
      policies: [],
      users: [currentUser],
      companies: [],
      currentUser,
    },
  },
  organization: {
    requireCompanyAcceptance: false,
    allowIndividualAcceptance: true,
    requireAuthorityConfirmation: false,
    whoCanAcceptForCompany: "any-user",
    requireManagerApproval: false,
    acceptanceScope: "individual",
    inheritanceRules: {
      newUsersInheritCompanyAcceptance: false,
      companyAcceptanceOverridesIndividual: false,
    },
    notifications: {
      enabled: true,
      reminderDays: [7, 3, 1],
      escalationChain: [],
      sendToManagers: false,
    },
    auditSettings: {
      logAllActions: true,
      requireDigitalSignature: false,
      retentionPeriodYears: 7,
      exportFormat: "json",
    },
  },
  currentUser,
  ui: {
    features: {
      showVersionHistory: true,
      showDiffComparison: true,
      showAcceptanceHistory: true,
      allowPolicyDownload: true,
      showDeadlineCountdown: true,
    },
    text: {
      defaultLanguage: "en",
    },
  },
  behavior: {
    autoShowOnLogin: false,
    blockAccessUntilAccepted: false,
    allowLaterReview: true,
    requireScrollToBottom: true,
  },
  callbacks: {},
  ...overrides,
});

export const createCompanyOnlyConfig = (
  currentUser: User,
  currentCompany: Company,
  overrides?: Partial<PolicyAcceptanceConfig>
): PolicyAcceptanceConfig => ({
  dataSource: {
    type: "local",
    localData: {
      policies: [],
      users: [currentUser],
      companies: [currentCompany],
      currentUser,
    },
  },
  organization: {
    requireCompanyAcceptance: true,
    allowIndividualAcceptance: false,
    requireAuthorityConfirmation: true,
    whoCanAcceptForCompany: "designated-users",
    requireManagerApproval: false,
    acceptanceScope: "company-wide",
    inheritanceRules: {
      newUsersInheritCompanyAcceptance: true,
      companyAcceptanceOverridesIndividual: true,
    },
    notifications: {
      enabled: true,
      reminderDays: [14, 7, 3, 1],
      escalationChain: currentCompany.adminUsers,
      sendToManagers: true,
    },
    auditSettings: {
      logAllActions: true,
      requireDigitalSignature: true,
      retentionPeriodYears: 10,
      exportFormat: "pdf",
    },
  },
  currentUser,
  currentCompany,
  ui: {
    features: {
      showVersionHistory: true,
      showDiffComparison: true,
      showAcceptanceHistory: true,
      allowPolicyDownload: true,
      showDeadlineCountdown: true,
    },
    text: {
      defaultLanguage: "en",
    },
  },
  behavior: {
    autoShowOnLogin: true,
    blockAccessUntilAccepted: true,
    allowLaterReview: false,
    requireScrollToBottom: true,
  },
  callbacks: {},
  ...overrides,
});

export const createHybridConfig = (
  currentUser: User,
  currentCompany: Company,
  overrides?: Partial<PolicyAcceptanceConfig>
): PolicyAcceptanceConfig => ({
  dataSource: {
    type: "local",
    localData: {
      policies: [],
      users: [currentUser],
      companies: [currentCompany],
      currentUser,
    },
  },
  organization: {
    requireCompanyAcceptance: true,
    allowIndividualAcceptance: true,
    requireAuthorityConfirmation: true,
    whoCanAcceptForCompany: "designated-users",
    requireManagerApproval: false,
    acceptanceScope: "both",
    inheritanceRules: {
      newUsersInheritCompanyAcceptance: false,
      companyAcceptanceOverridesIndividual: false,
    },
    notifications: {
      enabled: true,
      reminderDays: [7, 3, 1],
      escalationChain: currentCompany.adminUsers,
      sendToManagers: true,
    },
    auditSettings: {
      logAllActions: true,
      requireDigitalSignature: false,
      retentionPeriodYears: 7,
      exportFormat: "json",
    },
  },
  currentUser,
  currentCompany,
  ui: {
    features: {
      showVersionHistory: true,
      showDiffComparison: true,
      showAcceptanceHistory: true,
      allowPolicyDownload: true,
      showDeadlineCountdown: true,
    },
    text: {
      defaultLanguage: "en",
    },
  },
  behavior: {
    autoShowOnLogin: false,
    blockAccessUntilAccepted: false,
    allowLaterReview: true,
    requireScrollToBottom: true,
  },
  callbacks: {},
  ...overrides,
});

// Validation functions
export const validatePolicyVersion = (version: PolicyVersion): boolean => {
  return !!(
    version.id &&
    version.version &&
    version.date &&
    version.content &&
    new Date(version.date).toString() !== "Invalid Date"
  );
};

export const validateUser = (user: User): boolean => {
  return !!(
    user.id &&
    user.email &&
    user.name &&
    user.email.includes("@") &&
    user.role
  );
};

export const validateCompany = (company: Company): boolean => {
  return !!(company.id && company.name && Array.isArray(company.adminUsers));
};

// Permission and access control utilities
export const canUserAcceptForCompany = (
  user: User,
  company: Company,
  organizationSettings: OrganizationSettings
): boolean => {
  if (!organizationSettings.requireCompanyAcceptance) {
    return false;
  }

  switch (organizationSettings.whoCanAcceptForCompany) {
    case "admins-only":
      return user.role === "admin" || user.role === "company-admin";
    case "designated-users":
      return company.adminUsers.includes(user.id) || !!user.canAcceptForCompany;
    case "any-user":
      return user.companyId === company.id;
    default:
      return false;
  }
};

export const getPolicyAcceptanceStatus = (
  policy: PolicyData,
  user: User,
  organizationSettings: OrganizationSettings
): "accepted" | "pending" | "overdue" | "not-required" => {
  if (!policy.settings.requiresAcceptance) {
    return "not-required";
  }

  const currentVersion = policy.versions.find(
    (v) => v.version === policy.currentVersion
  );
  if (!currentVersion) {
    return "not-required";
  }

  // Check if user has accepted current version
  const userAcceptance = policy.userAcceptances.find(
    (a) =>
      a.userId === user.id && a.version === policy.currentVersion && a.isValid
  );

  if (userAcceptance) {
    return "accepted";
  }

  // Check if company acceptance covers this user
  if (
    organizationSettings.inheritanceRules.newUsersInheritCompanyAcceptance &&
    user.companyId
  ) {
    const companyAcceptance = policy.userAcceptances.find(
      (a) =>
        a.acceptanceType === "company" &&
        a.companyInfo?.companyName &&
        a.version === policy.currentVersion &&
        a.isValid
    );

    if (companyAcceptance) {
      return "accepted";
    }
  }

  // Check if overdue
  if (currentVersion.deadline) {
    const deadline = new Date(currentVersion.deadline);
    const now = new Date();
    if (now > deadline) {
      return "overdue";
    }
  }

  return "pending";
};

export const getRequiredPolicies = (
  policies: PolicyData[],
  user: User,
  organizationSettings: OrganizationSettings
): PolicyData[] => {
  return policies.filter((policy) => {
    const status = getPolicyAcceptanceStatus(
      policy,
      user,
      organizationSettings
    );
    return status === "pending" || status === "overdue";
  });
};

export const getUserAcceptances = (
  policies: PolicyData[],
  userId: string
): PolicyAcceptance[] => {
  return policies.flatMap((policy) =>
    policy.userAcceptances.filter(
      (acceptance) => acceptance.userId === userId && acceptance.isValid
    )
  );
};

// Date and formatting utilities
export const formatAcceptanceDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const calculateDaysUntilDeadline = (deadline: string): number => {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  return Math.ceil(
    (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
};

export const isVersionOverdue = (deadline?: string): boolean => {
  if (!deadline) return false;
  return calculateDaysUntilDeadline(deadline) < 0;
};

// Helper function to get policy type info
export const getPolicyTypeInfo = (type: PolicyData["type"]) => {
  switch (type) {
    case "terms":
      return {
        label: "Terms of Service",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };
    case "privacy":
      return {
        label: "Privacy Policy",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    case "cookies":
      return {
        label: "Cookie Policy",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
      };
    case "data-processing":
      return {
        label: "Data Processing Agreement",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      };
    case "security":
      return {
        label: "Information Security Policy",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    case "custom":
      return {
        label: "Policy",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      };
  }
};

// Sample data generators for testing and demos
export const generateSamplePolicies = (): PolicyData[] => [
  createPolicyData(
    "terms-001",
    "terms",
    "Terms of Service",
    [
      {
        id: "terms-v2.1",
        version: "2.1",
        date: "2025-10-01",
        deadline: "2025-12-31T23:59:59Z", // Future deadline - not overdue
        content: `Terms of Service - Version 2.1

Last Updated: October 1, 2025

1. ACCEPTANCE OF TERMS
By accessing and using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.

2. AI PROCESSING AND DATA USAGE
We have introduced new AI-powered features that process your data to provide enhanced services. This includes:
- Automated content analysis and recommendations
- Intelligent search and discovery features
- Personalized user experiences based on usage patterns

3. USER RESPONSIBILITIES
You are responsible for:
- Maintaining the confidentiality of your account credentials
- All activities that occur under your account
- Ensuring your use complies with applicable laws

4. PRIVACY AND DATA PROTECTION
Your privacy is important to us. Our use of your data is governed by our Privacy Policy, which has been updated to reflect new AI processing capabilities.

5. SERVICE MODIFICATIONS
We reserve the right to modify or discontinue services at any time, with or without notice.

6. LIMITATION OF LIABILITY
To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages.

7. GOVERNING LAW
These terms shall be governed by and construed in accordance with applicable laws.

For questions about these terms, please contact legal@company.com`,
        changes: [
          "Added AI processing section with detailed data usage information",
          "Updated privacy terms to reflect new AI capabilities",
          "Clarified user responsibilities for AI-generated content",
        ],
        isBreaking: true,
        isActive: true,
        createdBy: "legal-team",
      },
      {
        id: "terms-v2.0",
        version: "2.0",
        date: "2025-06-15",
        content: `Terms of Service - Version 2.0

Last Updated: June 15, 2025

1. ACCEPTANCE OF TERMS
By accessing our services, you agree to these terms.

2. USER RESPONSIBILITIES
Users must maintain account security and comply with all applicable laws.

3. PAYMENT TERMS
All payments are processed securely. Refunds available within 30 days.

4. SERVICE MODIFICATIONS
We may modify services with reasonable notice.

5. LIMITATION OF LIABILITY
Our liability is limited to the amount paid for services.`,
        changes: [
          "Updated payment terms",
          "Added refund policy",
          "Clarified service modification notice",
        ],
        isBreaking: false,
        isActive: false,
        createdBy: "legal-team",
      },
      {
        id: "terms-v1.0",
        version: "1.0",
        date: "2024-01-01",
        content: `Terms of Service - Version 1.0

Initial terms of service...`,
        changes: ["Initial version"],
        isBreaking: false,
        isActive: false,
        createdBy: "legal-team",
      },
    ],
    [
      {
        id: "acceptance-terms-001",
        policyId: "terms-001",
        version: "2.0",
        userId: "user-001",
        acceptedAt: "2025-07-01T10:30:00Z",
        acceptanceType: "individual",
        isValid: true,
      },
    ]
  ),
  createPolicyData("privacy-001", "privacy", "Privacy Policy", [
    {
      id: "privacy-v1.5",
      version: "1.5",
      date: "2025-09-15",
      deadline: "2025-10-15T23:59:59Z", // Past deadline - overdue
      content: `Privacy Policy - Version 1.5

Last Updated: September 15, 2025

1. INTRODUCTION
This Privacy Policy describes how we collect, use, and protect your personal information.

2. GDPR COMPLIANCE
We are committed to compliance with the General Data Protection Regulation (GDPR) and have updated our practices accordingly:
- Enhanced data subject rights
- Improved data breach notification procedures
- Strengthened consent mechanisms
- Data portability features

3. INFORMATION WE COLLECT
We collect information you provide directly to us, including:
- Account registration information
- Profile information
- Communications with us
- Payment information

4. HOW WE USE YOUR INFORMATION
We use the information we collect to:
- Provide and improve our services
- Communicate with you
- Ensure security and prevent fraud
- Comply with legal obligations

5. DATA SHARING AND DISCLOSURE
We may share your information with:
- Service providers who assist in our operations
- Legal authorities when required by law
- Business partners with your consent

6. YOUR RIGHTS
Under GDPR, you have the right to:
- Access your personal data
- Rectify inaccurate data
- Request erasure of your data
- Object to processing
- Data portability

7. DATA RETENTION
We retain your personal data only as long as necessary for the purposes outlined in this policy.

8. SECURITY
We implement appropriate technical and organizational measures to protect your data.

For privacy inquiries, contact privacy@company.com`,
      changes: [
        "GDPR compliance updates with enhanced data subject rights",
        "Added data portability section",
        "Updated data retention policies",
      ],
      isBreaking: false,
      isActive: true,
      createdBy: "legal-team",
    },
    {
      id: "privacy-v1.4",
      version: "1.4",
      date: "2025-03-01",
      content: `Privacy Policy - Version 1.4

Last Updated: March 1, 2025

1. INTRODUCTION
We respect your privacy and are committed to protecting your personal data.

2. DATA COLLECTION
We collect personal information when you register and use our services.

3. DATA USAGE
Your data is used to provide and improve our services.

4. DATA SHARING
We do not sell your personal information to third parties.

5. YOUR RIGHTS
You have the right to access, correct, or delete your personal data.`,
      changes: ["Updated cookie policy", "Added third-party integrations"],
      isBreaking: false,
      isActive: false,
      createdBy: "legal-team",
    },
  ]),
  createPolicyData("cookies-001", "cookies", "Cookie Policy", [
    {
      id: "cookies-v1.2",
      version: "1.2",
      date: "2025-10-20",
      // No deadline - optional acceptance
      content: `Cookie Policy - Version 1.2

Last Updated: October 20, 2025

1. WHAT ARE COOKIES
Cookies are small text files stored on your device when you visit our website.

2. TYPES OF COOKIES WE USE
- Essential Cookies: Required for basic site functionality
- Analytics Cookies: Help us understand how visitors use our site
- Marketing Cookies: Used to deliver relevant advertisements

3. MANAGING COOKIES
You can control cookies through your browser settings. Note that disabling certain cookies may affect site functionality.

4. THIRD-PARTY COOKIES
Some cookies are placed by third-party services that appear on our pages.

For more information, visit our Privacy Policy.`,
      changes: [
        "Updated cookie categories",
        "Added third-party cookie disclosure",
      ],
      isBreaking: false,
      isActive: true,
      createdBy: "legal-team",
    },
    {
      id: "cookies-v1.1",
      version: "1.1",
      date: "2025-05-10",
      content: `Cookie Policy - Version 1.1

Previous cookie policy content...`,
      changes: ["Initial cookie policy"],
      isBreaking: false,
      isActive: false,
      createdBy: "legal-team",
    },
  ]),
  createPolicyData(
    "dpa-001",
    "data-processing",
    "Data Processing Agreement",
    [
      {
        id: "dpa-v3.0",
        version: "3.0",
        date: "2025-10-25",
        deadline: "2025-11-30T23:59:59Z", // Future deadline
        content: `Data Processing Agreement - Version 3.0

Last Updated: October 25, 2025

1. DEFINITIONS
"Personal Data" means any information relating to an identified or identifiable natural person.
"Processing" means any operation performed on Personal Data.

2. SCOPE AND PURPOSE
This Agreement governs the processing of Personal Data by the Processor on behalf of the Controller.

3. PROCESSOR OBLIGATIONS
The Processor shall:
- Process Personal Data only on documented instructions from the Controller
- Ensure confidentiality of persons authorized to process Personal Data
- Implement appropriate technical and organizational security measures
- Assist the Controller in responding to data subject requests
- Delete or return Personal Data upon termination

4. SUB-PROCESSORS
The Processor may engage sub-processors with prior written consent from the Controller.

5. DATA SECURITY
The Processor implements industry-standard security measures including:
- Encryption of data in transit and at rest
- Regular security audits and penetration testing
- Access controls and authentication mechanisms
- Incident response procedures

6. DATA BREACH NOTIFICATION
The Processor shall notify the Controller within 24 hours of becoming aware of a data breach.

7. INTERNATIONAL TRANSFERS
Personal Data may be transferred internationally using approved transfer mechanisms.

8. AUDIT RIGHTS
The Controller has the right to audit the Processor's compliance with this Agreement.

For DPA inquiries, contact dpo@company.com`,
        changes: [
          "Enhanced security requirements with encryption standards",
          "Added 24-hour breach notification requirement",
          "Updated international transfer mechanisms",
          "Expanded audit rights section",
        ],
        isBreaking: true,
        isActive: true,
        createdBy: "legal-team",
      },
      {
        id: "dpa-v2.0",
        version: "2.0",
        date: "2025-04-10",
        content: `Data Processing Agreement - Version 2.0

Last Updated: April 10, 2025

1. DEFINITIONS
Standard definitions for data processing terms.

2. SCOPE
This agreement covers all personal data processing activities.

3. PROCESSOR OBLIGATIONS
Basic obligations for data processors.

4. SECURITY MEASURES
Standard security requirements.

5. DATA BREACH PROCEDURES
Notification within 72 hours of breach discovery.`,
        changes: [
          "Updated security measures",
          "Clarified processor obligations",
        ],
        isBreaking: false,
        isActive: false,
        createdBy: "legal-team",
      },
      {
        id: "dpa-v1.0",
        version: "1.0",
        date: "2024-06-01",
        content: `Data Processing Agreement - Version 1.0

Initial data processing agreement...`,
        changes: ["Initial version"],
        isBreaking: false,
        isActive: false,
        createdBy: "legal-team",
      },
    ],
    [
      {
        id: "acceptance-dpa-001",
        policyId: "dpa-001",
        version: "2.0",
        userId: "user-001",
        acceptedAt: "2025-05-15T14:20:00Z",
        acceptanceType: "individual",
        isValid: true,
      },
    ]
  ),
  createPolicyData("security-001", "security", "Information Security Policy", [
    {
      id: "security-v2.0",
      version: "2.0",
      date: "2025-10-28",
      deadline: "2025-11-15T23:59:59Z", // Urgent - 2 weeks
      content: `Information Security Policy - Version 2.0

Last Updated: October 28, 2025

1. PURPOSE
This policy establishes the framework for protecting information assets and ensuring business continuity.

2. SCOPE
This policy applies to all employees, contractors, and third parties with access to company systems.

3. INFORMATION CLASSIFICATION
Information is classified as:
- Public: No restrictions
- Internal: For internal use only
- Confidential: Restricted access
- Highly Confidential: Strictly controlled access

4. ACCESS CONTROL
- Multi-factor authentication required for all systems
- Role-based access control (RBAC) implementation
- Regular access reviews and recertification
- Immediate revocation upon termination

5. PASSWORD REQUIREMENTS
- Minimum 12 characters
- Combination of uppercase, lowercase, numbers, and symbols
- Password rotation every 90 days
- No password reuse for last 12 passwords

6. DEVICE SECURITY
- Full disk encryption required
- Automatic screen lock after 5 minutes
- Anti-malware software mandatory
- Regular security updates and patches

7. DATA PROTECTION
- Encryption for data at rest and in transit
- Secure data disposal procedures
- Regular backups with tested recovery procedures
- Data loss prevention (DLP) tools deployed

8. INCIDENT RESPONSE
- Immediate reporting of security incidents
- 24/7 security operations center (SOC)
- Defined escalation procedures
- Post-incident review and remediation

9. COMPLIANCE
Regular security audits and compliance assessments conducted.

10. TRAINING
Annual security awareness training required for all personnel.

For security concerns, contact security@company.com`,
      changes: [
        "Implemented mandatory multi-factor authentication",
        "Enhanced password requirements to 12 characters",
        "Added data loss prevention requirements",
        "Updated incident response procedures with 24/7 SOC",
      ],
      isBreaking: true,
      isActive: true,
      createdBy: "security-team",
    },
    {
      id: "security-v1.0",
      version: "1.0",
      date: "2024-08-01",
      content: `Information Security Policy - Version 1.0

Basic security policy content...`,
      changes: ["Initial security policy"],
      isBreaking: false,
      isActive: false,
      createdBy: "security-team",
    },
  ]),
];

export const generateSampleUsers = (): User[] => [
  createUser(
    "user-001",
    "john@acme.com",
    "John Smith",
    "user",
    "company-001",
    false
  ),
  createUser(
    "user-002",
    "jane@acme.com",
    "Jane Doe",
    "company-admin",
    "company-001",
    true
  ),
  createUser("user-003", "bob@freelance.com", "Bob Wilson", "user"),
];

export const generateSampleCompanies = (): Company[] => [
  createCompany("company-001", "Acme Corporation", ["user-002"], {
    requireAuthorityConfirmation: true,
    requireTitleAndEmail: true,
    allowDelegatedAcceptance: false,
    notificationEmails: ["legal@acme.com"],
  }),
];

export const compareVersions = (v1: string, v2: string): number => {
  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }

  return 0;
};

export const canAcceptVersion = (
  policy: PolicyData,
  version: string,
  userId: string
): { canAccept: boolean; reason?: string; missingVersion?: string } => {
  // Find all versions older than the target version
  const targetVersionIndex = policy.versions.findIndex(
    (v) => v.version === version
  );
  if (targetVersionIndex === -1) {
    return { canAccept: false, reason: "Version not found" };
  }

  // Get all older versions (versions come sorted newest to oldest)
  const olderVersions = policy.versions.slice(targetVersionIndex + 1);

  // Check if all older versions have been accepted
  for (const olderVersion of olderVersions) {
    const hasAccepted = policy.userAcceptances.some(
      (a) =>
        a.userId === userId && a.version === olderVersion.version && a.isValid
    );

    if (!hasAccepted) {
      return {
        canAccept: false,
        reason: `You must accept version ${olderVersion.version} before accepting version ${version}`,
        missingVersion: olderVersion.version,
      };
    }
  }

  return { canAccept: true };
};
