"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var index_exports = {};
__export(index_exports, {
  AIAssistantBar: () => AIAssistantBar,
  CompanyAcceptanceForm: () => CompanyAcceptanceForm,
  DeadlineIndicator: () => DeadlineIndicator,
  PolicyAcceptanceContext: () => PolicyAcceptanceContext,
  PolicyAcceptanceDashboard: () => PolicyAcceptanceDashboard,
  PolicyAcceptanceModal: () => PolicyAcceptanceModal,
  PolicyAcceptanceProvider: () => PolicyAcceptanceProvider,
  PolicyDiff: () => PolicyDiff,
  PolicyVersioningDemo: () => PolicyVersioningDemo,
  VersionBadge: () => VersionBadge,
  VersionHistory: () => VersionHistory,
  calculateDaysUntilDeadline: () => calculateDaysUntilDeadline,
  canAcceptVersion: () => canAcceptVersion,
  canUserAcceptForCompany: () => canUserAcceptForCompany,
  compareVersions: () => compareVersions,
  createCompany: () => createCompany,
  createCompanyOnlyConfig: () => createCompanyOnlyConfig,
  createHybridConfig: () => createHybridConfig,
  createIndividualOnlyConfig: () => createIndividualOnlyConfig,
  createPolicyData: () => createPolicyData,
  createUser: () => createUser,
  formatAcceptanceDate: () => formatAcceptanceDate,
  generateSampleCompanies: () => generateSampleCompanies,
  generateSamplePolicies: () => generateSamplePolicies,
  generateSampleUsers: () => generateSampleUsers,
  getPolicyAcceptanceStatus: () => getPolicyAcceptanceStatus,
  getPolicyTypeInfo: () => getPolicyTypeInfo,
  getRequiredPolicies: () => getRequiredPolicies,
  getUserAcceptances: () => getUserAcceptances,
  isVersionOverdue: () => isVersionOverdue,
  usePolicyAcceptance: () => usePolicyAcceptance,
  validateCompany: () => validateCompany,
  validatePolicyVersion: () => validatePolicyVersion,
  validateUser: () => validateUser
});
module.exports = __toCommonJS(index_exports);

// provider/policy-acceptance-provider.tsx
var import_react = require("react");

// utils/index.ts
var createPolicyData = (id, type, title, versions, userAcceptances = [], settings) => {
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
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    settings: {
      requiresAcceptance: true,
      allowVersionRollback: false,
      retentionPeriodDays: 2555,
      // 7 years
      notificationSettings: {
        sendReminders: true,
        reminderDays: [7, 3, 1],
        escalationEmails: []
      },
      ...settings
    }
  };
};
var createUser = (id, email, name, role = "user", companyId, canAcceptForCompany = false) => ({
  id,
  email,
  name,
  role,
  companyId,
  canAcceptForCompany,
  isActive: true,
  createdAt: (/* @__PURE__ */ new Date()).toISOString()
});
var createCompany = (id, name, adminUsers = [], settings) => ({
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
    ...settings
  },
  createdAt: (/* @__PURE__ */ new Date()).toISOString(),
  isActive: true
});
var createIndividualOnlyConfig = (currentUser, overrides) => ({
  dataSource: {
    type: "local",
    localData: {
      policies: [],
      users: [currentUser],
      companies: [],
      currentUser
    }
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
      companyAcceptanceOverridesIndividual: false
    },
    notifications: {
      enabled: true,
      reminderDays: [7, 3, 1],
      escalationChain: [],
      sendToManagers: false
    },
    auditSettings: {
      logAllActions: true,
      requireDigitalSignature: false,
      retentionPeriodYears: 7,
      exportFormat: "json"
    }
  },
  currentUser,
  ui: {
    features: {
      showVersionHistory: true,
      showDiffComparison: true,
      showAcceptanceHistory: true,
      allowPolicyDownload: true,
      showDeadlineCountdown: true
    },
    text: {
      defaultLanguage: "en"
    }
  },
  behavior: {
    autoShowOnLogin: false,
    blockAccessUntilAccepted: false,
    allowLaterReview: true,
    requireScrollToBottom: true
  },
  callbacks: {},
  ...overrides
});
var createCompanyOnlyConfig = (currentUser, currentCompany, overrides) => ({
  dataSource: {
    type: "local",
    localData: {
      policies: [],
      users: [currentUser],
      companies: [currentCompany],
      currentUser
    }
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
      companyAcceptanceOverridesIndividual: true
    },
    notifications: {
      enabled: true,
      reminderDays: [14, 7, 3, 1],
      escalationChain: currentCompany.adminUsers,
      sendToManagers: true
    },
    auditSettings: {
      logAllActions: true,
      requireDigitalSignature: true,
      retentionPeriodYears: 10,
      exportFormat: "pdf"
    }
  },
  currentUser,
  currentCompany,
  ui: {
    features: {
      showVersionHistory: true,
      showDiffComparison: true,
      showAcceptanceHistory: true,
      allowPolicyDownload: true,
      showDeadlineCountdown: true
    },
    text: {
      defaultLanguage: "en"
    }
  },
  behavior: {
    autoShowOnLogin: true,
    blockAccessUntilAccepted: true,
    allowLaterReview: false,
    requireScrollToBottom: true
  },
  callbacks: {},
  ...overrides
});
var createHybridConfig = (currentUser, currentCompany, overrides) => ({
  dataSource: {
    type: "local",
    localData: {
      policies: [],
      users: [currentUser],
      companies: [currentCompany],
      currentUser
    }
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
      companyAcceptanceOverridesIndividual: false
    },
    notifications: {
      enabled: true,
      reminderDays: [7, 3, 1],
      escalationChain: currentCompany.adminUsers,
      sendToManagers: true
    },
    auditSettings: {
      logAllActions: true,
      requireDigitalSignature: false,
      retentionPeriodYears: 7,
      exportFormat: "json"
    }
  },
  currentUser,
  currentCompany,
  ui: {
    features: {
      showVersionHistory: true,
      showDiffComparison: true,
      showAcceptanceHistory: true,
      allowPolicyDownload: true,
      showDeadlineCountdown: true
    },
    text: {
      defaultLanguage: "en"
    }
  },
  behavior: {
    autoShowOnLogin: false,
    blockAccessUntilAccepted: false,
    allowLaterReview: true,
    requireScrollToBottom: true
  },
  callbacks: {},
  ...overrides
});
var validatePolicyVersion = (version) => {
  return !!(version.id && version.version && version.date && version.content && new Date(version.date).toString() !== "Invalid Date");
};
var validateUser = (user) => {
  return !!(user.id && user.email && user.name && user.email.includes("@") && user.role);
};
var validateCompany = (company) => {
  return !!(company.id && company.name && Array.isArray(company.adminUsers));
};
var canUserAcceptForCompany = (user, company, organizationSettings) => {
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
var getPolicyAcceptanceStatus = (policy, user, organizationSettings) => {
  if (!policy.settings.requiresAcceptance) {
    return "not-required";
  }
  const currentVersion = policy.versions.find(
    (v) => v.version === policy.currentVersion
  );
  if (!currentVersion) {
    return "not-required";
  }
  const userAcceptance = policy.userAcceptances.find(
    (a) => a.userId === user.id && a.version === policy.currentVersion && a.isValid
  );
  if (userAcceptance) {
    return "accepted";
  }
  if (organizationSettings.inheritanceRules.newUsersInheritCompanyAcceptance && user.companyId) {
    const companyAcceptance = policy.userAcceptances.find(
      (a) => a.acceptanceType === "company" && a.companyInfo?.companyName && a.version === policy.currentVersion && a.isValid
    );
    if (companyAcceptance) {
      return "accepted";
    }
  }
  if (currentVersion.deadline) {
    const deadline = new Date(currentVersion.deadline);
    const now = /* @__PURE__ */ new Date();
    if (now > deadline) {
      return "overdue";
    }
  }
  return "pending";
};
var getRequiredPolicies = (policies, user, organizationSettings) => {
  return policies.filter((policy) => {
    const status = getPolicyAcceptanceStatus(
      policy,
      user,
      organizationSettings
    );
    return status === "pending" || status === "overdue";
  });
};
var getUserAcceptances = (policies, userId) => {
  return policies.flatMap(
    (policy) => policy.userAcceptances.filter(
      (acceptance) => acceptance.userId === userId && acceptance.isValid
    )
  );
};
var formatAcceptanceDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};
var calculateDaysUntilDeadline = (deadline) => {
  const deadlineDate = new Date(deadline);
  const now = /* @__PURE__ */ new Date();
  return Math.ceil(
    (deadlineDate.getTime() - now.getTime()) / (1e3 * 60 * 60 * 24)
  );
};
var isVersionOverdue = (deadline) => {
  if (!deadline) return false;
  return calculateDaysUntilDeadline(deadline) < 0;
};
var getPolicyTypeInfo = (type) => {
  switch (type) {
    case "terms":
      return {
        label: "Terms of Service",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
      };
    case "privacy":
      return {
        label: "Privacy Policy",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      };
    case "cookies":
      return {
        label: "Cookie Policy",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200"
      };
    case "data-processing":
      return {
        label: "Data Processing Agreement",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200"
      };
    case "security":
      return {
        label: "Information Security Policy",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200"
      };
    case "custom":
      return {
        label: "Policy",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200"
      };
  }
};
var generateSamplePolicies = () => [
  createPolicyData(
    "terms-001",
    "terms",
    "Terms of Service",
    [
      {
        id: "terms-v2.1",
        version: "2.1",
        date: "2025-10-01",
        deadline: "2025-12-31T23:59:59Z",
        // Future deadline - not overdue
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
          "Clarified user responsibilities for AI-generated content"
        ],
        isBreaking: true,
        isActive: true,
        createdBy: "legal-team"
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
          "Clarified service modification notice"
        ],
        isBreaking: false,
        isActive: false,
        createdBy: "legal-team"
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
        createdBy: "legal-team"
      }
    ],
    [
      {
        id: "acceptance-terms-001",
        policyId: "terms-001",
        version: "2.0",
        userId: "user-001",
        acceptedAt: "2025-07-01T10:30:00Z",
        acceptanceType: "individual",
        isValid: true
      }
    ]
  ),
  createPolicyData("privacy-001", "privacy", "Privacy Policy", [
    {
      id: "privacy-v1.5",
      version: "1.5",
      date: "2025-09-15",
      deadline: "2025-10-15T23:59:59Z",
      // Past deadline - overdue
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
        "Updated data retention policies"
      ],
      isBreaking: false,
      isActive: true,
      createdBy: "legal-team"
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
      createdBy: "legal-team"
    }
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
        "Added third-party cookie disclosure"
      ],
      isBreaking: false,
      isActive: true,
      createdBy: "legal-team"
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
      createdBy: "legal-team"
    }
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
        deadline: "2025-11-30T23:59:59Z",
        // Future deadline
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
          "Expanded audit rights section"
        ],
        isBreaking: true,
        isActive: true,
        createdBy: "legal-team"
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
          "Clarified processor obligations"
        ],
        isBreaking: false,
        isActive: false,
        createdBy: "legal-team"
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
        createdBy: "legal-team"
      }
    ],
    [
      {
        id: "acceptance-dpa-001",
        policyId: "dpa-001",
        version: "2.0",
        userId: "user-001",
        acceptedAt: "2025-05-15T14:20:00Z",
        acceptanceType: "individual",
        isValid: true
      }
    ]
  ),
  createPolicyData("security-001", "security", "Information Security Policy", [
    {
      id: "security-v2.0",
      version: "2.0",
      date: "2025-10-28",
      deadline: "2025-11-15T23:59:59Z",
      // Urgent - 2 weeks
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
        "Updated incident response procedures with 24/7 SOC"
      ],
      isBreaking: true,
      isActive: true,
      createdBy: "security-team"
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
      createdBy: "security-team"
    }
  ])
];
var generateSampleUsers = () => [
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
  createUser("user-003", "bob@freelance.com", "Bob Wilson", "user")
];
var generateSampleCompanies = () => [
  createCompany("company-001", "Acme Corporation", ["user-002"], {
    requireAuthorityConfirmation: true,
    requireTitleAndEmail: true,
    allowDelegatedAcceptance: false,
    notificationEmails: ["legal@acme.com"]
  })
];
var compareVersions = (v1, v2) => {
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
var canAcceptVersion = (policy, version, userId) => {
  const targetVersionIndex = policy.versions.findIndex(
    (v) => v.version === version
  );
  if (targetVersionIndex === -1) {
    return { canAccept: false, reason: "Version not found" };
  }
  const olderVersions = policy.versions.slice(targetVersionIndex + 1);
  for (const olderVersion of olderVersions) {
    const hasAccepted = policy.userAcceptances.some(
      (a) => a.userId === userId && a.version === olderVersion.version && a.isValid
    );
    if (!hasAccepted) {
      return {
        canAccept: false,
        reason: `You must accept version ${olderVersion.version} before accepting version ${version}`,
        missingVersion: olderVersion.version
      };
    }
  }
  return { canAccept: true };
};

// provider/policy-acceptance-provider.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var PolicyAcceptanceContext = (0, import_react.createContext)(null);
var PolicyAcceptanceProvider = ({ children, config }) => {
  const [policies, setPolicies] = (0, import_react.useState)(config.dataSource.localData?.policies || []);
  const [users, setUsers] = (0, import_react.useState)(config.dataSource.localData?.users || []);
  const [companies, setCompanies] = (0, import_react.useState)(config.dataSource.localData?.companies || []);
  const [currentPolicy, setCurrentPolicy] = (0, import_react.useState)(null);
  const [isLoading, setIsLoading] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)(null);
  const currentUser = config.currentUser;
  const currentCompany = config.currentCompany;
  const refreshData = async () => {
    if (config.dataSource.type === "local") {
      return;
    }
    if (!config.dataSource.apiEndpoints?.getPolicies) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(config.dataSource.apiEndpoints.getPolicies);
      if (!response.ok) {
        throw new Error(`Failed to fetch policies: ${response.statusText}`);
      }
      const data = await response.json();
      setPolicies(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      config.callbacks.onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };
  const acceptPolicy = async (policyId, version, acceptanceType, companyInfo) => {
    const acceptance = {
      id: `acceptance-${Date.now()}`,
      policyId,
      version,
      userId: currentUser.id,
      acceptedAt: (/* @__PURE__ */ new Date()).toISOString(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : void 0,
      acceptanceType,
      companyInfo,
      isValid: true
    };
    if (config.callbacks.beforeAcceptance) {
      const shouldProceed = await config.callbacks.beforeAcceptance(acceptance);
      if (!shouldProceed) {
        return;
      }
    }
    if (config.dataSource.apiEndpoints?.submitAcceptance) {
      setIsLoading(true);
      try {
        const response = await fetch(config.dataSource.apiEndpoints.submitAcceptance, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(acceptance)
        });
        if (!response.ok) {
          throw new Error(`Failed to submit acceptance: ${response.statusText}`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to submit acceptance";
        setError(errorMessage);
        config.callbacks.onError?.(err instanceof Error ? err : new Error(errorMessage), "acceptPolicy");
        return;
      } finally {
        setIsLoading(false);
      }
    }
    setPolicies(
      (prevPolicies) => prevPolicies.map(
        (policy) => policy.id === policyId ? {
          ...policy,
          userAcceptances: [...policy.userAcceptances, acceptance]
        } : policy
      )
    );
    config.callbacks.onAcceptance?.(acceptance);
    config.integrations?.analytics?.trackAcceptance?.(acceptance);
    config.integrations?.audit?.logAction?.("policy_accepted", acceptance);
  };
  const declinePolicy = async (policyId, reason) => {
    const declineData = {
      policyId,
      userId: currentUser.id,
      declinedAt: (/* @__PURE__ */ new Date()).toISOString(),
      reason
    };
    config.callbacks.onDecline?.(policyId, reason);
    config.integrations?.analytics?.trackDecline?.(declineData);
    config.integrations?.audit?.logAction?.("policy_declined", declineData);
  };
  const canUserAcceptForCompanyFn = (userId, companyId) => {
    const user = users.find((u) => u.id === userId);
    const company = companies.find((c) => c.id === (companyId || user?.companyId));
    if (!user || !company) return false;
    return canUserAcceptForCompany(user, company, config.organization);
  };
  const getPolicyAcceptanceStatusFn = (policyId, userId) => {
    const policy = policies.find((p) => p.id === policyId);
    const user = users.find((u) => u.id === (userId || currentUser.id));
    if (!policy || !user) return "not-required";
    return getPolicyAcceptanceStatus(policy, user, config.organization);
  };
  const getRequiredPoliciesFn = (userId) => {
    const user = users.find((u) => u.id === (userId || currentUser.id));
    if (!user) return [];
    return getRequiredPolicies(policies, user, config.organization);
  };
  const getUserAcceptancesFn = (userId) => {
    const targetUserId = userId || currentUser.id;
    return getUserAcceptances(policies, targetUserId);
  };
  (0, import_react.useEffect)(() => {
    if (config.dataSource.type === "api" && config.dataSource.apiEndpoints?.getPolicies) {
      refreshData();
    }
  }, [config.dataSource.apiEndpoints?.getPolicies]);
  const contextValue = {
    policies,
    currentPolicy,
    users,
    companies,
    currentUser,
    currentCompany,
    isLoading,
    error,
    config,
    organizationSettings: config.organization,
    acceptPolicy,
    declinePolicy,
    refreshData,
    canUserAcceptForCompany: canUserAcceptForCompanyFn,
    getPolicyAcceptanceStatus: getPolicyAcceptanceStatusFn,
    getRequiredPolicies: getRequiredPoliciesFn,
    getUserAcceptances: getUserAcceptancesFn
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolicyAcceptanceContext.Provider, { value: contextValue, children });
};

// hooks/use-policy-acceptance.ts
var import_react2 = require("react");
var usePolicyAcceptance = () => {
  const context = (0, import_react2.useContext)(PolicyAcceptanceContext);
  if (!context) {
    throw new Error("usePolicyAcceptance must be used within a PolicyAcceptanceProvider");
  }
  return context;
};

// components/policy-acceptance-modal.tsx
var import_react3 = require("react");

// components/ui/button.tsx
var import_react_slot = require("@radix-ui/react-slot");
var import_class_variance_authority = require("class-variance-authority");

// lib/utils.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// components/ui/button.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var buttonVariants = (0, import_class_variance_authority.cva)(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? import_react_slot.Slot : "button";
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}

// components/ui/dialog.tsx
var DialogPrimitive = __toESM(require("@radix-ui/react-dialog"));
var import_lucide_react = require("lucide-react");
var import_jsx_runtime3 = require("react/jsx-runtime");
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(DialogPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(DialogPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    DialogPrimitive.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(DialogOverlay, {}),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      DialogPrimitive.Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
            DialogPrimitive.Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_lucide_react.XIcon, {}),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    DialogPrimitive.Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    DialogPrimitive.Description,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}

// components/ui/tabs.tsx
var TabsPrimitive = __toESM(require("@radix-ui/react-tabs"));
var import_jsx_runtime4 = require("react/jsx-runtime");
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    TabsPrimitive.Root,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    TabsPrimitive.List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    TabsPrimitive.Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    TabsPrimitive.Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}

// components/ui/scroll-area.tsx
var ScrollAreaPrimitive = __toESM(require("@radix-ui/react-scroll-area"));
var import_jsx_runtime5 = require("react/jsx-runtime");
function ScrollArea({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    ScrollAreaPrimitive.Root,
    {
      "data-slot": "scroll-area",
      className: cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          ScrollAreaPrimitive.Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ScrollBar, {}),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ScrollAreaPrimitive.Corner, {})
      ]
    }
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    ScrollAreaPrimitive.ScrollAreaScrollbar,
    {
      "data-slot": "scroll-area-scrollbar",
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      ),
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        ScrollAreaPrimitive.ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "bg-border relative flex-1 rounded-full"
        }
      )
    }
  );
}

// components/ui/checkbox.tsx
var CheckboxPrimitive = __toESM(require("@radix-ui/react-checkbox"));
var import_lucide_react2 = require("lucide-react");
var import_jsx_runtime6 = require("react/jsx-runtime");
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    CheckboxPrimitive.Root,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        CheckboxPrimitive.Indicator,
        {
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current transition-none",
          children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react2.CheckIcon, { className: "size-3.5" })
        }
      )
    }
  );
}

// components/policy-acceptance-modal.tsx
var import_lucide_react8 = require("lucide-react");

// components/ui/card.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
function Card({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}

// components/ui/badge.tsx
var import_react_slot2 = require("@radix-ui/react-slot");
var import_class_variance_authority2 = require("class-variance-authority");
var import_jsx_runtime8 = require("react/jsx-runtime");
var badgeVariants = (0, import_class_variance_authority2.cva)(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? import_react_slot2.Slot : "span";
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}

// components/policy-diff.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
function PolicyDiff({ currentVersion, previousVersion }) {
  const renderDiffContent = () => {
    if (!previousVersion) {
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "space-y-4", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "bg-green-50 border-l-4 border-green-400 p-4 rounded", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h4", { className: "font-medium text-green-800 mb-2", children: "New Policy" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "text-sm text-green-700 whitespace-pre-wrap", children: currentVersion.content })
      ] }) });
    }
    const currentLines = currentVersion.content.split("\n");
    const previousLines = previousVersion.content.split("\n");
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "space-y-2", children: currentLines.map((line, index) => {
      const previousLine = previousLines[index];
      const isNew = !previousLine || line !== previousLine;
      const isModified = previousLine && line !== previousLine;
      if (isNew && !previousLine) {
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "bg-green-50 border-l-4 border-green-400 p-2 rounded", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-xs text-green-600 font-mono", children: "+ " }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-sm text-green-800", children: line })
        ] }, index);
      }
      if (isModified) {
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "space-y-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "bg-red-50 border-l-4 border-red-400 p-2 rounded", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-xs text-red-600 font-mono", children: "- " }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-sm text-red-800 line-through", children: previousLine })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "bg-green-50 border-l-4 border-green-400 p-2 rounded", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-xs text-green-600 font-mono", children: "+ " }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-sm text-green-800", children: line })
          ] })
        ] }, index);
      }
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "p-2", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-sm text-gray-700", children: line }) }, index);
    }) });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(Card, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(CardHeader, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(CardTitle, { className: "text-lg", children: "Policy Changes" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex gap-2", children: [
          previousVersion && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(Badge, { variant: "outline", children: [
            "From v",
            previousVersion.version
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(Badge, { children: [
            "To v",
            currentVersion.version
          ] })
        ] })
      ] }),
      currentVersion.changes && currentVersion.changes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "space-y-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h4", { className: "text-sm font-medium text-muted-foreground", children: "Summary of Changes:" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("ul", { className: "text-sm space-y-1", children: currentVersion.changes.map((change, index) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("li", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-blue-500 mt-1", children: "\u2022" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: change })
        ] }, index)) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ScrollArea, { className: "h-64 w-full border rounded-md p-4", children: renderDiffContent() }) })
  ] });
}

// components/version-badge.tsx
var import_lucide_react3 = require("lucide-react");
var import_jsx_runtime10 = require("react/jsx-runtime");
function VersionBadge({ version, isAccepted, isCurrent, isBreaking, className }) {
  const getVariant = () => {
    if (isCurrent && isAccepted) return "default";
    if (isCurrent) return "secondary";
    if (isAccepted) return "secondary";
    return "outline";
  };
  const getIcon = () => {
    if (isCurrent && isAccepted) return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react3.CheckCircle, { className: "h-3 w-3" });
    if (isCurrent) return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react3.AlertCircle, { className: "h-3 w-3" });
    if (isAccepted) return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react3.CheckCircle, { className: "h-3 w-3" });
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react3.Clock, { className: "h-3 w-3" });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(Badge, { variant: getVariant(), className: `gap-1 ${className || ""}`, children: [
    getIcon(),
    "v",
    version,
    isBreaking && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "text-xs", children: "\u26A0\uFE0F" })
  ] });
}

// components/version-history.tsx
var import_lucide_react5 = require("lucide-react");

// components/deadline-indicator.tsx
var import_lucide_react4 = require("lucide-react");
var import_jsx_runtime11 = require("react/jsx-runtime");
function DeadlineIndicator({ deadline, isAccepted, className }) {
  const deadlineDate = new Date(deadline);
  const now = /* @__PURE__ */ new Date();
  const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1e3 * 60 * 60 * 24));
  const isOverdue = daysUntilDeadline < 0;
  const isUrgent = daysUntilDeadline <= 3 && daysUntilDeadline >= 0;
  const isSoon = daysUntilDeadline <= 7 && daysUntilDeadline > 3;
  if (isAccepted) {
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(Badge, { variant: "secondary", className: `gap-1 ${className || ""}`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_lucide_react4.CheckCircle, { className: "h-3 w-3" }),
      "Accepted"
    ] });
  }
  if (isOverdue) {
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex items-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(Badge, { variant: "destructive", className: "gap-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_lucide_react4.XCircle, { className: "h-3 w-3" }),
        "Overdue"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { className: "text-sm text-muted-foreground", children: [
        Math.abs(daysUntilDeadline),
        " day",
        Math.abs(daysUntilDeadline) !== 1 ? "s" : "",
        " ago \u2022 Due",
        " ",
        deadlineDate.toLocaleDateString()
      ] })
    ] });
  }
  if (isUrgent) {
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(Badge, { variant: "destructive", className: `gap-1 ${className || ""}`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_lucide_react4.AlertTriangle, { className: "h-3 w-3" }),
      daysUntilDeadline,
      " day",
      daysUntilDeadline !== 1 ? "s" : "",
      " left"
    ] });
  }
  if (isSoon) {
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(Badge, { variant: "secondary", className: `gap-1 border-amber-200 bg-amber-50 text-amber-700 ${className || ""}`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_lucide_react4.Clock, { className: "h-3 w-3" }),
      daysUntilDeadline,
      " days left"
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(Badge, { variant: "outline", className: `gap-1 ${className || ""}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_lucide_react4.Clock, { className: "h-3 w-3" }),
    "Due ",
    deadlineDate.toLocaleDateString()
  ] });
}

// components/version-history.tsx
var import_jsx_runtime12 = require("react/jsx-runtime");
var getPolicyTypeInfo2 = (type) => {
  switch (type) {
    case "terms":
      return {
        label: "Terms of Service",
        icon: import_lucide_react5.FileText,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
      };
    case "privacy":
      return {
        label: "Privacy Policy",
        icon: import_lucide_react5.Shield,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      };
    case "cookies":
      return {
        label: "Cookie Policy",
        icon: import_lucide_react5.Cookie,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200"
      };
    case "data-processing":
      return {
        label: "Data Processing Agreement",
        icon: import_lucide_react5.FileText,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200"
      };
    case "security":
      return {
        label: "Security Policy",
        icon: import_lucide_react5.Shield,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200"
      };
    case "custom":
      return {
        label: "Policy",
        icon: import_lucide_react5.FileText,
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200"
      };
  }
};
function VersionHistory({
  versions,
  acceptances,
  currentVersion,
  onViewVersion,
  onCompareVersions,
  policyType = "terms"
}) {
  const isVersionAccepted = (version) => {
    return acceptances.some((acceptance) => acceptance.version === version);
  };
  const getAcceptance = (version) => {
    return acceptances.find((a) => a.version === version);
  };
  const policyTypeInfo = getPolicyTypeInfo2(policyType);
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex items-center gap-2 mb-3 flex-shrink-0", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react5.Calendar, { className: "h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("h3", { className: "text-base font-semibold", children: "Version History" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(ScrollArea, { className: "flex-1 min-h-0", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "space-y-3 pr-4", children: versions.map((version, index) => {
      const acceptance = getAcceptance(version.version);
      const isAccepted = !!acceptance;
      const isCurrent = version.version === currentVersion;
      const previousVersion = versions[index + 1];
      const PolicyIcon = policyTypeInfo.icon;
      return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "border rounded-lg p-3 space-y-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
              VersionBadge,
              {
                version: version.version,
                isAccepted,
                isCurrent,
                isBreaking: version.isBreaking
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react5.Clock, { className: "h-3 w-3" }),
                version.date
              ] }),
              version.deadline && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DeadlineIndicator, { deadline: version.deadline, isAccepted, className: "text-xs" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex gap-2 flex-shrink-0", children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => onViewVersion(version.version),
                className: "h-8 px-3 text-xs",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react5.Eye, { className: "h-3 w-3 mr-1" }),
                  "View"
                ]
              }
            ),
            previousVersion && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => onCompareVersions(version.version, previousVersion.version),
                className: "h-8 px-3 text-xs",
                children: "Compare"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
          "div",
          {
            className: `flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${policyTypeInfo.bgColor} ${policyTypeInfo.borderColor} border`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(PolicyIcon, { className: `h-3 w-3 ${policyTypeInfo.color}` }),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: policyTypeInfo.color, children: policyTypeInfo.label })
            ]
          }
        ) }),
        acceptance && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "bg-green-50 border border-green-200 rounded-lg p-2 space-y-1.5", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex items-center gap-2 text-xs font-medium text-green-800", children: [
          acceptance.acceptanceType === "company" ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react5.Building2, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react5.User, { className: "h-3 w-3" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { children: acceptance.acceptanceType === "company" ? acceptance.companyInfo?.companyName || "Company" : "Individual" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "text-green-600 ml-auto", children: "Accepted" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "text-green-600", children: new Date(acceptance.acceptedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          }) })
        ] }) }),
        version.changes && version.changes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("h4", { className: "text-xs font-medium text-gray-700", children: "Key Changes:" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("ul", { className: "text-xs text-muted-foreground space-y-1", children: [
            version.changes.slice(0, 2).map((change, changeIndex) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("li", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "text-blue-500 mt-0.5 flex-shrink-0", children: "\u2022" }),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "break-words line-clamp-2", children: change })
            ] }, changeIndex)),
            version.changes.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("li", { className: "text-xs text-muted-foreground ml-4", children: [
              "+",
              version.changes.length - 2,
              " more..."
            ] })
          ] })
        ] })
      ] }, version.version);
    }) }) })
  ] });
}

// components/ui/input.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}

// components/ui/label.tsx
var LabelPrimitive = __toESM(require("@radix-ui/react-label"));
var import_jsx_runtime14 = require("react/jsx-runtime");
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}

// components/ui/radio-group.tsx
var RadioGroupPrimitive = __toESM(require("@radix-ui/react-radio-group"));
var import_lucide_react6 = require("lucide-react");
var import_jsx_runtime15 = require("react/jsx-runtime");
function RadioGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
    RadioGroupPrimitive.Root,
    {
      "data-slot": "radio-group",
      className: cn("grid gap-3", className),
      ...props
    }
  );
}
function RadioGroupItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
    RadioGroupPrimitive.Item,
    {
      "data-slot": "radio-group-item",
      className: cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
        RadioGroupPrimitive.Indicator,
        {
          "data-slot": "radio-group-indicator",
          className: "relative flex items-center justify-center",
          children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react6.CircleIcon, { className: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" })
        }
      )
    }
  );
}

// components/company-acceptance-form.tsx
var import_lucide_react7 = require("lucide-react");
var import_jsx_runtime16 = require("react/jsx-runtime");
function CompanyAcceptanceForm({
  acceptanceType,
  onAcceptanceTypeChange,
  companyInfo,
  onCompanyInfoChange,
  hasAuthority,
  onAuthorityChange,
  isValid
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(Card, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_lucide_react7.Building2, { className: "h-5 w-5" }),
      "Acceptance Type"
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(RadioGroup, { value: acceptanceType, onValueChange: onAcceptanceTypeChange, children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(RadioGroupItem, { value: "individual", id: "individual" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(Label, { htmlFor: "individual", className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_lucide_react7.User, { className: "h-4 w-4" }),
            "Individual Acceptance"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(RadioGroupItem, { value: "company", id: "company" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(Label, { htmlFor: "company", className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_lucide_react7.Building2, { className: "h-4 w-4" }),
            "Company/Organization Acceptance"
          ] })
        ] })
      ] }),
      acceptanceType === "individual" && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { className: "text-sm text-blue-800", children: "You are accepting this policy as an individual user. This acceptance applies only to your personal use of the service." }) }),
      acceptanceType === "company" && /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "bg-amber-50 border border-amber-200 rounded-lg p-4", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_lucide_react7.AlertTriangle, { className: "h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { className: "text-sm text-amber-800", children: "You are accepting this policy on behalf of your organization. Please ensure you have the authority to bind your organization to these terms." })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Label, { htmlFor: "companyName", children: "Company/Organization Name *" }),
            /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
              Input,
              {
                id: "companyName",
                value: companyInfo.companyName,
                onChange: (e) => onCompanyInfoChange({ ...companyInfo, companyName: e.target.value }),
                placeholder: "Enter company name",
                className: "mt-1"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Label, { htmlFor: "acceptorName", children: "Your Full Name *" }),
              /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
                Input,
                {
                  id: "acceptorName",
                  value: companyInfo.acceptorName,
                  onChange: (e) => onCompanyInfoChange({ ...companyInfo, acceptorName: e.target.value }),
                  placeholder: "Enter your full name",
                  className: "mt-1"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Label, { htmlFor: "acceptorTitle", children: "Your Title/Position *" }),
              /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
                Input,
                {
                  id: "acceptorTitle",
                  value: companyInfo.acceptorTitle,
                  onChange: (e) => onCompanyInfoChange({ ...companyInfo, acceptorTitle: e.target.value }),
                  placeholder: "e.g., CEO, Legal Counsel, CTO",
                  className: "mt-1"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Label, { htmlFor: "acceptorEmail", children: "Your Email Address *" }),
            /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
              Input,
              {
                id: "acceptorEmail",
                type: "email",
                value: companyInfo.acceptorEmail,
                onChange: (e) => onCompanyInfoChange({ ...companyInfo, acceptorEmail: e.target.value }),
                placeholder: "your.email@company.com",
                className: "mt-1"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "space-y-3", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "flex items-start space-x-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Checkbox, { id: "authority", checked: hasAuthority, onCheckedChange: onAuthorityChange, className: "mt-1" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(Label, { htmlFor: "authority", className: "text-sm leading-relaxed", children: [
            "I confirm that I have the legal authority to bind",
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { className: "font-medium", children: companyInfo.companyName || "my organization" }),
            " to these terms and conditions. I understand that this acceptance will apply to all users within our organization who access this service."
          ] })
        ] }) }),
        !isValid && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-3", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { className: "text-sm text-red-800", children: "Please fill in all required fields and confirm your authority to proceed." }) })
      ] })
    ] })
  ] });
}

// utils/version-acceptance.ts
function canAcceptVersion2(policy, version, userId) {
  const versionIndex = policy.versions.findIndex((v) => v.version === version);
  if (versionIndex === -1) {
    return {
      canAccept: false,
      reason: "Version not found"
    };
  }
  if (versionIndex === policy.versions.length - 1) {
    return {
      canAccept: true
    };
  }
  const previousVersions = policy.versions.slice(versionIndex + 1);
  for (const prevVersion of previousVersions) {
    const hasAccepted = policy.userAcceptances.some(
      (acceptance) => acceptance.userId === userId && acceptance.version === prevVersion.version && acceptance.isValid
    );
    if (!hasAccepted) {
      return {
        canAccept: false,
        reason: `You must accept version ${prevVersion.version} before accepting version ${version}`
      };
    }
  }
  return {
    canAccept: true
  };
}

// components/policy-acceptance-modal.tsx
var import_jsx_runtime17 = require("react/jsx-runtime");
var PolicyAcceptanceModal = ({
  isOpen,
  onClose,
  policyId,
  initialVersion
}) => {
  const { policies, acceptPolicy, config, currentUser } = usePolicyAcceptance();
  const [selectedPolicyId, setSelectedPolicyId] = (0, import_react3.useState)("");
  const [hasReadPolicy, setHasReadPolicy] = (0, import_react3.useState)(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = (0, import_react3.useState)(false);
  const [selectedTab, setSelectedTab] = (0, import_react3.useState)("current");
  const [viewingVersion, setViewingVersion] = (0, import_react3.useState)("");
  const [compareVersions2, setCompareVersions] = (0, import_react3.useState)(null);
  const [acceptanceType, setAcceptanceType] = (0, import_react3.useState)("individual");
  const [companyInfo, setCompanyInfo] = (0, import_react3.useState)({
    companyName: "",
    acceptorName: "",
    acceptorTitle: "",
    acceptorEmail: ""
  });
  const [hasAuthority, setHasAuthority] = (0, import_react3.useState)(false);
  const getEarliestUnacceptedPolicy = () => {
    for (const policy of policies) {
      const reversedVersions = [...policy.versions].reverse();
      for (const version of reversedVersions) {
        const isAccepted = policy.userAcceptances.some(
          (a) => a.userId === currentUser.id && a.version === version.version && a.isValid
        );
        if (!isAccepted) {
          return policy.id;
        }
      }
    }
    return policies[0]?.id;
  };
  (0, import_react3.useEffect)(() => {
    if (isOpen) {
      if (policyId) {
        setSelectedPolicyId(policyId);
      } else {
        const earliestPolicy = getEarliestUnacceptedPolicy();
        setSelectedPolicyId(earliestPolicy || policies[0]?.id || "");
      }
      if (initialVersion) {
        setViewingVersion(initialVersion);
        setSelectedTab("view");
      } else {
        setSelectedTab("current");
      }
      setHasReadPolicy(false);
      setIsScrolledToBottom(false);
      setCompareVersions(null);
    }
  }, [isOpen, policyId, initialVersion, policies]);
  (0, import_react3.useEffect)(() => {
    setHasReadPolicy(false);
    setIsScrolledToBottom(false);
    setSelectedTab("current");
    setViewingVersion("");
    setCompareVersions(null);
  }, [selectedPolicyId]);
  const policyData = policies.find((p) => p.id === selectedPolicyId);
  if (!policyData) {
    return null;
  }
  const currentVersion = policyData.versions[0];
  const previousVersion = policyData.versions[1];
  const isCurrentAccepted = policyData.userAcceptances.some(
    (a) => a.userId === currentUser.id && a.version === currentVersion.version && a.isValid
  );
  const needsAcceptance = !isCurrentAccepted;
  const versionAcceptanceCheck = canAcceptVersion2(policyData, currentVersion.version, currentUser.id);
  const canAcceptCurrentVersion = versionAcceptanceCheck.canAccept;
  const handleScrollChange = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    setIsScrolledToBottom(isAtBottom);
  };
  const handleViewVersion = (version) => {
    setViewingVersion(version);
    setSelectedTab("view");
  };
  const handleCompareVersions = (current, previous) => {
    setCompareVersions({ current, previous });
    setSelectedTab("compare");
  };
  const isCompanyFormValid = acceptanceType === "individual" || companyInfo.companyName.trim() !== "" && companyInfo.acceptorName.trim() !== "" && companyInfo.acceptorTitle.trim() !== "" && companyInfo.acceptorEmail.trim() !== "" && hasAuthority;
  const canAccept = hasReadPolicy && isScrolledToBottom && needsAcceptance && isCompanyFormValid && canAcceptCurrentVersion;
  const getVersionByNumber = (version) => {
    return policyData.versions.find((v) => v.version === version);
  };
  const handleAccept = async () => {
    await acceptPolicy(
      policyData.id,
      currentVersion.version,
      acceptanceType,
      acceptanceType === "company" ? companyInfo : void 0
    );
    onClose();
  };
  const handleDecline = () => {
    config.callbacks.onDecline?.(policyData.id);
    onClose();
  };
  const getVisibleAcceptances = () => {
    if (config.organization.whoCanAcceptForCompany !== "any-user") {
      return policyData.userAcceptances;
    } else {
      return policyData.userAcceptances.filter((acceptance) => acceptance.acceptanceType === "individual");
    }
  };
  const visibleAcceptances = getVisibleAcceptances();
  const shouldShowAcceptanceForm = selectedTab === "current" && needsAcceptance;
  const getViewingVersionAcceptance = () => {
    if (!viewingVersion) return null;
    return visibleAcceptances.find((a) => a.version === viewingVersion);
  };
  const viewingVersionAcceptance = getViewingVersionAcceptance();
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Dialog, { open: isOpen, onOpenChange: (open) => !open && onClose(), children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(DialogContent, { className: "max-w-7xl max-h-[90vh] p-0 w-[95vw] flex flex-col", children: [
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Button, { variant: "ghost", size: "sm", className: "absolute right-4 top-4 z-10 h-8 w-8 p-0", onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react8.X, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(ScrollArea, { className: "flex-1 overflow-auto", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "p-6", children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(DialogHeader, { className: "pb-4", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "flex items-center justify-between pr-8", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-center gap-3 min-w-0 flex-1", children: [
        needsAcceptance ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react8.AlertTriangle, { className: "h-6 w-6 text-amber-500 flex-shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react8.FileText, { className: "h-6 w-6 text-blue-500 flex-shrink-0" }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "min-w-0 flex-1", children: [
          policies.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "mb-3", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { children: "Select component goes here" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(DialogTitle, { className: "text-xl", children: [
            policyData.title,
            needsAcceptance && " - Update Required"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(DialogDescription, { className: "mt-1 flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "text-sm", children: needsAcceptance ? "Please review and accept the latest version to continue." : "You're up to date with the current policy version." }),
            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
              VersionBadge,
              {
                version: currentVersion.version,
                isAccepted: isCurrentAccepted,
                isCurrent: true,
                isBreaking: currentVersion.isBreaking
              }
            )
          ] }),
          currentVersion.deadline && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "mt-2", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(DeadlineIndicator, { deadline: currentVersion.deadline, isAccepted: isCurrentAccepted }) }),
          !canAcceptCurrentVersion && versionAcceptanceCheck.reason && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("p", { className: "text-sm text-amber-800 flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react8.AlertTriangle, { className: "h-4 w-4 flex-shrink-0" }),
            versionAcceptanceCheck.reason
          ] }) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(Tabs, { value: selectedTab, onValueChange: setSelectedTab, className: "w-full", children: [
          /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(TabsList, { className: "grid w-full grid-cols-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(TabsTrigger, { value: "current", className: "flex items-center gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react8.FileText, { className: "h-4 w-4" }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "hidden sm:inline", children: "Current" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(TabsTrigger, { value: "changes", className: "flex items-center gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react8.GitCompare, { className: "h-4 w-4" }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "hidden sm:inline", children: "Changes" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(TabsTrigger, { value: "history", className: "flex items-center gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react8.History, { className: "h-4 w-4" }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "hidden sm:inline", children: "History" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(TabsTrigger, { value: "view", disabled: !viewingVersion, className: "text-xs", children: viewingVersion ? `v${viewingVersion}` : "View" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "mt-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(TabsContent, { value: "current", className: "space-y-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "bg-muted/50 rounded-lg p-4", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex justify-between items-center text-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("span", { className: "font-medium", children: [
                  "Version ",
                  currentVersion.version
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("span", { className: "text-muted-foreground", children: [
                  "Released: ",
                  currentVersion.date
                ] })
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(ScrollArea, { className: "h-64 w-full border rounded-md p-4", onScrollCapture: handleScrollChange, children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "text-sm leading-relaxed whitespace-pre-wrap", children: currentVersion.content }) }),
              !isScrolledToBottom && needsAcceptance && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("p", { className: "text-xs text-muted-foreground text-center", children: "Please scroll to the bottom to continue" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(TabsContent, { value: "changes", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(PolicyDiff, { currentVersion, previousVersion }) }),
            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(TabsContent, { value: "history", className: "mt-0", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "h-[500px] max-h-[60vh]", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
              VersionHistory,
              {
                versions: policyData.versions,
                acceptances: visibleAcceptances,
                currentVersion: currentVersion.version,
                onViewVersion: handleViewVersion,
                onCompareVersions: handleCompareVersions,
                policyType: policyData.type
              }
            ) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(TabsContent, { value: "view", children: viewingVersion && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "space-y-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "bg-muted/50 rounded-lg p-4", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex justify-between items-center text-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("span", { className: "font-medium", children: [
                  "Version ",
                  viewingVersion
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("span", { className: "text-muted-foreground", children: [
                  "Released: ",
                  getVersionByNumber(viewingVersion)?.date
                ] })
              ] }) }),
              viewingVersionAcceptance && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(Card, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(CardTitle, { className: "text-lg flex items-center gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react8.FileText, { className: "h-5 w-5" }),
                  "Acceptance Information"
                ] }) }),
                /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(CardContent, { className: "space-y-4", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-center gap-3", children: [
                      viewingVersionAcceptance.acceptanceType === "company" ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react8.Building2, { className: "h-5 w-5 text-blue-600" }) : /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react8.User, { className: "h-5 w-5 text-green-600" }),
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { children: [
                        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "font-medium", children: viewingVersionAcceptance.acceptanceType === "company" ? "Company Acceptance" : "Individual Acceptance" }),
                        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "text-sm text-muted-foreground", children: "Acceptance Type" })
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react8.Calendar, { className: "h-5 w-5 text-gray-600" }),
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { children: [
                        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "font-medium", children: new Date(viewingVersionAcceptance.acceptedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        }) }),
                        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "text-sm text-muted-foreground", children: new Date(viewingVersionAcceptance.acceptedAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit"
                        }) })
                      ] })
                    ] })
                  ] }),
                  viewingVersionAcceptance.acceptanceType === "company" && viewingVersionAcceptance.companyInfo && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "border-t pt-4 space-y-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("h4", { className: "font-medium text-gray-900", children: "Company Details" }),
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { children: [
                        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "font-medium text-gray-700", children: "Company:" }),
                        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "text-gray-600", children: viewingVersionAcceptance.companyInfo.companyName })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { children: [
                        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "font-medium text-gray-700", children: "Accepted by:" }),
                        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "text-gray-600", children: viewingVersionAcceptance.companyInfo.acceptorTitle })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "md:col-span-2", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "font-medium text-gray-700", children: "Contact:" }),
                        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "text-gray-600", children: viewingVersionAcceptance.companyInfo.acceptorEmail })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "border-t pt-4", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-center gap-2 text-sm text-green-600", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react8.Clock, { className: "h-4 w-4" }),
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("span", { children: [
                      "Accepted",
                      " ",
                      Math.floor(
                        ((/* @__PURE__ */ new Date()).getTime() - new Date(viewingVersionAcceptance.acceptedAt).getTime()) / (1e3 * 60 * 60 * 24)
                      ),
                      " ",
                      "days ago"
                    ] })
                  ] }) })
                ] })
              ] }),
              !viewingVersionAcceptance && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(CardContent, { className: "pt-6", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "text-center text-muted-foreground", children: [
                /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react8.FileText, { className: "h-12 w-12 mx-auto mb-2 opacity-50" }),
                /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("p", { children: "This version has not been accepted yet." })
              ] }) }) }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(ScrollArea, { className: "h-64 w-full border rounded-md p-4", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "text-sm leading-relaxed whitespace-pre-wrap", children: getVersionByNumber(viewingVersion)?.content }) })
            ] }) }),
            compareVersions2 && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(TabsContent, { value: "compare", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
              PolicyDiff,
              {
                currentVersion: getVersionByNumber(compareVersions2.current),
                previousVersion: getVersionByNumber(compareVersions2.previous)
              }
            ) })
          ] })
        ] }),
        shouldShowAcceptanceForm && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "space-y-4 border-t pt-4", children: [
          config.organization.allowIndividualAcceptance && config.organization.requireCompanyAcceptance && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
            CompanyAcceptanceForm,
            {
              acceptanceType,
              onAcceptanceTypeChange: setAcceptanceType,
              companyInfo,
              onCompanyInfoChange: setCompanyInfo,
              hasAuthority,
              onAuthorityChange: setHasAuthority,
              isValid: isCompanyFormValid
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
              Checkbox,
              {
                id: "policy-read",
                checked: hasReadPolicy,
                onCheckedChange: (checked) => setHasReadPolicy(checked),
                disabled: !isScrolledToBottom || !canAcceptCurrentVersion
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
              "label",
              {
                htmlFor: "policy-read",
                className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                children: [
                  "I have read and understand version ",
                  currentVersion.version,
                  " of the",
                  " ",
                  policyData.title.toLowerCase()
                ]
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(DialogFooter, { className: "gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
              Button,
              {
                variant: "outline",
                onClick: handleDecline,
                className: "text-destructive hover:text-destructive bg-transparent",
                children: "I'll review later"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(Button, { onClick: handleAccept, disabled: !canAccept, children: [
              "Accept Version ",
              currentVersion.version
            ] })
          ] })
        ] }),
        !shouldShowAcceptanceForm && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "border-t pt-4", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Button, { onClick: onClose, variant: "outline", children: "Close" }) }) })
      ] })
    ] }) })
  ] }) });
};

// components/policy-versioning-demo.tsx
var import_react4 = require("react");
var import_lucide_react9 = require("lucide-react");
var import_jsx_runtime18 = require("react/jsx-runtime");
var PolicyVersioningDemo = () => {
  const { policies, config, currentUser } = usePolicyAcceptance();
  const [showModal, setShowModal] = (0, import_react4.useState)(false);
  const [selectedPolicyId, setSelectedPolicyId] = (0, import_react4.useState)(
    void 0
  );
  const [selectedVersion, setSelectedVersion] = (0, import_react4.useState)(
    void 0
  );
  if (!policies || policies.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "max-w-6xl mx-auto", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(CardContent, { className: "pt-6", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "text-center text-muted-foreground", children: [
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react9.FileText, { className: "h-12 w-12 mx-auto mb-2 opacity-50" }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { children: "No policy data available." })
    ] }) }) }) }) });
  }
  const getEarliestUnacceptedPolicy = () => {
    for (const policy of policies) {
      const reversedVersions = [...policy.versions].reverse();
      for (const version of reversedVersions) {
        const isAccepted = policy.userAcceptances.some(
          (acceptance) => acceptance.userId === currentUser.id && acceptance.version === version.version && acceptance.isValid
        );
        if (!isAccepted) {
          return policy;
        }
      }
    }
    return policies[0];
  };
  const policyData = getEarliestUnacceptedPolicy();
  const currentVersion = policyData.versions[0];
  const isCurrentAccepted = policyData.userAcceptances.some(
    (acceptance) => acceptance.userId === currentUser.id && acceptance.version === currentVersion.version && acceptance.isValid
  );
  const lastAcceptedVersion = policyData.userAcceptances.filter(
    (acceptance) => acceptance.userId === currentUser.id && acceptance.isValid
  ).sort(
    (a, b) => new Date(b.acceptedAt).getTime() - new Date(a.acceptedAt).getTime()
  )[0];
  const getVisibleAcceptances = () => {
    if (config.organization.whoCanAcceptForCompany !== "any-user") {
      return policyData.userAcceptances;
    }
    return policyData.userAcceptances.filter(
      (acceptance) => acceptance.acceptanceType === "individual"
    );
  };
  const visibleAcceptances = getVisibleAcceptances();
  const policyTypeInfo = getPolicyTypeInfo(policyData.type);
  const handleVersionClick = (policyId, version) => {
    setSelectedPolicyId(policyId);
    setSelectedVersion(version);
    setShowModal(true);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "max-w-6xl mx-auto space-y-8", children: [
    /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Policy Version Management" }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { className: "text-lg text-gray-600", children: "Advanced policy acceptance with version tracking and diff comparison" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "grid lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(Card, { className: "lg:col-span-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(CardHeader, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(CardTitle, { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { children: "Current Policy Status" }),
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
              VersionBadge,
              {
                version: currentVersion.version,
                isAccepted: isCurrentAccepted,
                isCurrent: true,
                isBreaking: currentVersion.isBreaking
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(CardDescription, { children: isCurrentAccepted ? "You're up to date with the latest policy version" : "Action required: Please review and accept the latest policy version" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "grid md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("h4", { className: "font-medium", children: "Current Version" }),
              /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "text-sm text-muted-foreground", children: [
                "Version ",
                currentVersion.version,
                " \u2022 Released",
                " ",
                currentVersion.date
              ] }),
              currentVersion.isBreaking && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Badge, { variant: "destructive", className: "text-xs", children: "Breaking Changes" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("h4", { className: "font-medium", children: "Your Status" }),
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "text-sm text-muted-foreground", children: lastAcceptedVersion ? `Last accepted: v${lastAcceptedVersion.version}` : "No versions accepted yet" }),
              !isCurrentAccepted && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Badge, { variant: "outline", className: "text-xs", children: "Update Required" })
            ] })
          ] }),
          currentVersion.changes && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("h4", { className: "font-medium", children: "Latest Changes" }),
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("ul", { className: "text-sm text-muted-foreground space-y-1", children: currentVersion.changes.slice(0, 3).map((change, index) => /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("li", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "text-blue-500 mt-1", children: "\u2022" }),
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { children: change })
            ] }, index)) })
          ] }),
          currentVersion.deadline && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("h4", { className: "font-medium", children: "Acceptance Deadline" }),
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
              DeadlineIndicator,
              {
                deadline: currentVersion.deadline,
                isAccepted: isCurrentAccepted
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
            Button,
            {
              onClick: () => handleVersionClick(policyData.id, currentVersion.version),
              className: "w-full",
              variant: isCurrentAccepted ? "outline" : "default",
              children: isCurrentAccepted ? "Review Policy" : "Accept Latest Version"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(Card, { className: "flex flex-col", children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(CardHeader, { className: "flex-shrink-0", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(CardTitle, { children: "Version Acceptances" }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(CardDescription, { children: "Policy acceptance history and status" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(CardContent, { className: "flex-1 min-h-0 p-0", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(ScrollArea, { className: "h-[400px] px-6 pb-6", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "space-y-2", children: policyData.versions.map((version) => {
          const acceptance = visibleAcceptances.find(
            (candidate) => candidate.version === version.version
          );
          const isAccepted = !!acceptance;
          const isCurrent = version.version === currentVersion.version;
          const PolicyIcon = policyTypeInfo.label === "Terms of Service" ? import_lucide_react9.FileText : policyTypeInfo.label === "Privacy Policy" ? import_lucide_react9.Shield : import_lucide_react9.Cookie;
          const acceptanceCheck = canAcceptVersion(
            policyData,
            version.version,
            currentUser.id
          );
          const isBlocked = !isAccepted && !acceptanceCheck.canAccept;
          return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
            "div",
            {
              className: "border rounded-lg p-2 space-y-1.5 cursor-pointer hover:bg-gray-50 transition-colors",
              onClick: () => handleVersionClick(policyData.id, version.version),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "flex items-center justify-between gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "flex items-center gap-2 min-w-0 flex-1", children: [
                    isAccepted && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react9.CheckCircle2, { className: "h-4 w-4 text-green-600 flex-shrink-0" }),
                    isBlocked && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react9.Lock, { className: "h-4 w-4 text-gray-400 flex-shrink-0" }),
                    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                      VersionBadge,
                      {
                        version: version.version,
                        isAccepted,
                        isCurrent,
                        isBreaking: version.isBreaking
                      }
                    ),
                    version.deadline && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                      DeadlineIndicator,
                      {
                        deadline: version.deadline,
                        isAccepted,
                        className: "text-xs"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "text-xs text-muted-foreground flex-shrink-0", children: version.date })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
                  "div",
                  {
                    className: `flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${policyTypeInfo.bgColor} ${policyTypeInfo.borderColor} border`,
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                        PolicyIcon,
                        {
                          className: `h-3 w-3 ${policyTypeInfo.color}`
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: policyTypeInfo.color, children: policyTypeInfo.label })
                    ]
                  }
                ) }),
                acceptance && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "bg-gray-50 rounded-md px-2 py-1.5 flex items-center justify-between gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "flex items-center gap-2 text-xs min-w-0 flex-1", children: acceptance.acceptanceType === "company" ? /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(import_jsx_runtime18.Fragment, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react9.Building2, { className: "h-3.5 w-3.5 text-blue-600 flex-shrink-0" }),
                    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "font-medium truncate", children: acceptance.companyInfo?.companyName || "Company" })
                  ] }) : /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(import_jsx_runtime18.Fragment, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react9.User, { className: "h-3.5 w-3.5 text-green-600 flex-shrink-0" }),
                    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "font-medium truncate", children: currentUser.name })
                  ] }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "text-xs text-muted-foreground flex-shrink-0 text-right", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "text-green-600 font-medium", children: "Accepted" }),
                    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { children: new Date(
                      acceptance.acceptedAt
                    ).toLocaleDateString() })
                  ] })
                ] }),
                !acceptance && isBlocked && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded flex items-center gap-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react9.Lock, { className: "h-3 w-3" }),
                  "Accept v",
                  acceptanceCheck.missingVersion,
                  " first"
                ] }),
                !acceptance && !isBlocked && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded", children: "Not yet accepted" })
              ]
            },
            version.version
          );
        }) }) }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      PolicyAcceptanceModal,
      {
        isOpen: showModal,
        onClose: () => {
          setShowModal(false);
          setSelectedPolicyId(void 0);
          setSelectedVersion(void 0);
        },
        policyId: selectedPolicyId,
        initialVersion: selectedVersion
      }
    )
  ] }) });
};

// components/policy-acceptance-dashboard.tsx
var import_react6 = require("react");
var import_lucide_react12 = require("lucide-react");

// components/ui/select.tsx
var SelectPrimitive = __toESM(require("@radix-ui/react-select"));
var import_lucide_react10 = require("lucide-react");
var import_jsx_runtime19 = require("react/jsx-runtime");
function Select({
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(SelectPrimitive.Root, { "data-slot": "select", ...props });
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(SelectPrimitive.Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
    SelectPrimitive.Trigger,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react10.ChevronDownIcon, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(SelectPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
    SelectPrimitive.Content,
    {
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(SelectScrollUpButton, {}),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
    SelectPrimitive.Item,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react10.CheckIcon, { className: "size-4" }) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(SelectPrimitive.ItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
    SelectPrimitive.ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react10.ChevronUpIcon, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
    SelectPrimitive.ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react10.ChevronDownIcon, { className: "size-4" })
    }
  );
}

// components/ai-assistant-bar.tsx
var import_react5 = require("react");
var import_lucide_react11 = require("lucide-react");
var import_jsx_runtime20 = require("react/jsx-runtime");
var AIAssistantBar = ({ config }) => {
  const [viewState, setViewState] = (0, import_react5.useState)("collapsed");
  const [messages, setMessages] = (0, import_react5.useState)([]);
  const [inputValue, setInputValue] = (0, import_react5.useState)("");
  const [isLoading, setIsLoading] = (0, import_react5.useState)(false);
  const messagesEndRef = (0, import_react5.useRef)(null);
  const inputRef = (0, import_react5.useRef)(null);
  const {
    assistantName = "Legal Assistant",
    assistantIcon = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-11-11%20at%2019.06.06-lH3VF48nnvY8JvK7gLrcswCke3VFsm.png",
    placeholder = "Ask about policies or compliance...",
    welcomeMessage = "\u{1F44B} Need help understanding policies or compliance requirements? Let me know!",
    suggestedPrompts = ["Explain the privacy policy", "What are the main changes?", "Who needs to accept this?"],
    brandColor = "#6366F1",
    allowMinimize = true
  } = config;
  (0, import_react5.useEffect)(() => {
    if (messages.length === 0 && welcomeMessage) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: welcomeMessage,
          timestamp: /* @__PURE__ */ new Date()
        }
      ]);
    }
  }, []);
  (0, import_react5.useEffect)(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  (0, import_react5.useEffect)(() => {
    if (viewState === "expanded" || viewState === "fullscreen") {
      inputRef.current?.focus();
    }
  }, [viewState]);
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: /* @__PURE__ */ new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    try {
      const response = await config.onSendMessage(userMessage.content, messages);
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: /* @__PURE__ */ new Date()
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Assistant error:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: /* @__PURE__ */ new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSuggestedPrompt = (prompt) => {
    setInputValue(prompt);
    if (viewState === "collapsed") {
      setViewState("expanded");
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const ChatInterface = ({ isFullscreen }) => {
    if (isFullscreen) {
      return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "h-full flex bg-white", children: [
        /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "w-64 border-r border-gray-200 flex flex-col bg-gray-50/50", children: [
          /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "p-4 border-b border-gray-200 bg-white", children: [
            /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("img", { src: assistantIcon || "/placeholder.svg", alt: "AI", className: "h-8 w-8" }),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("h2", { className: "font-semibold text-blue-600 text-lg", children: assistantName.toLowerCase() })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(
              Button,
              {
                className: "w-full bg-blue-100 hover:bg-blue-200 text-blue-700 gap-2 rounded-lg font-medium",
                onClick: () => {
                  setMessages([
                    {
                      id: "welcome",
                      role: "assistant",
                      content: welcomeMessage,
                      timestamp: /* @__PURE__ */ new Date()
                    }
                  ]);
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react11.MessageSquare, { className: "h-4 w-4" }),
                  "Start New Chat"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex-1 overflow-auto", children: [
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "p-3", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("button", { className: "w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors", children: [
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react11.Bell, { className: "h-4 w-4" }),
              "My Updates"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "px-3 pb-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "text-xs font-medium text-gray-500 mb-2 px-3", children: "This Month" }),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("button", { className: "w-full text-left px-3 py-2 text-sm bg-gray-200 text-gray-900 rounded-lg font-medium", children: "Current Conversation" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "p-3 border-t border-gray-200 bg-white", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("p", { className: "text-xs text-gray-500 leading-relaxed", children: [
            assistantName,
            " may make mistakes and is not legal, financial or investment advice."
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex-1 flex flex-col", children: [
          /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200", children: [
            /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react11.MessageSquare, { className: "h-5 w-5 text-blue-600" }),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("h3", { className: "font-semibold text-gray-900", children: "Policy Questions?" }),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Button, { size: "sm", variant: "ghost", className: "h-6 rounded", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
              Button,
              {
                size: "icon",
                variant: "ghost",
                className: "h-8 w-8 rounded-lg hover:bg-gray-100",
                onClick: () => setViewState("expanded"),
                children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react11.Minimize2, { className: "h-4 w-4 text-gray-600" })
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "flex-1 overflow-hidden bg-white", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(ScrollArea, { className: "h-full", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "p-6 space-y-4 max-w-4xl mx-auto", children: [
            messages.map((message) => /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(
              "div",
              {
                className: cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start"),
                children: [
                  message.role === "assistant" && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
                    "img",
                    {
                      src: assistantIcon || "/placeholder.svg",
                      alt: "AI",
                      className: "h-8 w-8 flex-shrink-0 mt-1"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
                    "div",
                    {
                      className: cn(
                        "rounded-2xl px-4 py-3 max-w-[75%]",
                        message.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"
                      ),
                      children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("p", { className: "text-sm leading-relaxed whitespace-pre-wrap", children: message.content })
                    }
                  )
                ]
              },
              message.id
            )),
            isLoading && /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex gap-3 justify-start", children: [
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("img", { src: assistantIcon || "/placeholder.svg", alt: "AI", className: "h-8 w-8 flex-shrink-0 mt-1" }),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
                  "div",
                  {
                    className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                    style: { animationDelay: "0ms" }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
                  "div",
                  {
                    className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                    style: { animationDelay: "150ms" }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
                  "div",
                  {
                    className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                    style: { animationDelay: "300ms" }
                  }
                )
              ] }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { ref: messagesEndRef })
          ] }) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "p-6 border-t border-gray-200 bg-white", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-200", children: [
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("img", { src: assistantIcon || "/placeholder.svg", alt: "AI", className: "h-7 w-7 flex-shrink-0" }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
              Input,
              {
                ref: inputRef,
                value: inputValue,
                onChange: (e) => setInputValue(e.target.value),
                onKeyPress: handleKeyPress,
                placeholder: "Type @ to quick search",
                disabled: isLoading,
                className: "flex-1 border-0 bg-transparent focus-visible:ring-0 text-sm placeholder:text-gray-400"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
              Button,
              {
                size: "icon",
                onClick: handleSendMessage,
                disabled: !inputValue.trim() || isLoading,
                className: "h-9 w-9 rounded-full flex-shrink-0 bg-blue-600 hover:bg-blue-700",
                children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react11.ArrowUp, { className: "h-4 w-4 text-white" })
              }
            )
          ] }) }) })
        ] })
      ] });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "h-full flex flex-col", children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-blue-100 flex-shrink-0", children: [
        /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("img", { src: assistantIcon || "/placeholder.svg", alt: "AI Assistant", className: "h-8 w-8" }),
          /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("h3", { className: "font-semibold text-sm text-gray-900", children: assistantName }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex items-center gap-1.5 text-xs text-gray-600", children: [
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "w-1.5 h-1.5 rounded-full bg-green-500" }),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { children: "Online" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
            Button,
            {
              size: "icon",
              variant: "ghost",
              className: "h-8 w-8 rounded-lg hover:bg-blue-50",
              onClick: () => setViewState("fullscreen"),
              children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react11.Maximize2, { className: "h-4 w-4 text-gray-600" })
            }
          ),
          allowMinimize && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
            Button,
            {
              size: "icon",
              variant: "ghost",
              className: "h-8 w-8 rounded-lg hover:bg-blue-50",
              onClick: () => setViewState("collapsed"),
              children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react11.Minimize2, { className: "h-4 w-4 text-gray-600" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "flex-1 bg-white overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(ScrollArea, { className: "h-full", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "p-4 space-y-4", children: [
        messages.map((message) => /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(
          "div",
          {
            className: cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start"),
            children: [
              message.role === "assistant" && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("img", { src: assistantIcon || "/placeholder.svg", alt: "AI", className: "h-8 w-8 flex-shrink-0" }),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
                "div",
                {
                  className: cn(
                    "rounded-2xl px-4 py-3 max-w-[85%]",
                    message.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"
                  ),
                  children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("p", { className: "text-sm leading-relaxed whitespace-pre-wrap", children: message.content })
                }
              )
            ]
          },
          message.id
        )),
        isLoading && /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex gap-3 justify-start", children: [
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("img", { src: assistantIcon || "/placeholder.svg", alt: "AI", className: "h-8 w-8 flex-shrink-0" }),
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
              "div",
              {
                className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                style: { animationDelay: "0ms" }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
              "div",
              {
                className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                style: { animationDelay: "150ms" }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
              "div",
              {
                className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                style: { animationDelay: "300ms" }
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { ref: messagesEndRef })
      ] }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        "div",
        {
          className: "p-3 border-t border-blue-100 flex-shrink-0",
          style: {
            background: "linear-gradient(135deg, #E8EEFF 0%, #F0F4FF 100%)"
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm", children: [
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("img", { src: assistantIcon || "/placeholder.svg", alt: "AI", className: "h-6 w-6 flex-shrink-0" }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
              Input,
              {
                ref: inputRef,
                value: inputValue,
                onChange: (e) => setInputValue(e.target.value),
                onKeyPress: handleKeyPress,
                placeholder: "Type @ to quick search",
                disabled: isLoading,
                className: "flex-1 border-0 bg-transparent focus-visible:ring-0 text-sm"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
              Button,
              {
                size: "icon",
                onClick: handleSendMessage,
                disabled: !inputValue.trim() || isLoading,
                className: "h-8 w-8 rounded-full flex-shrink-0",
                style: { backgroundColor: brandColor },
                children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react11.ArrowUp, { className: "h-4 w-4 text-white" })
              }
            )
          ] })
        }
      )
    ] });
  };
  if (viewState === "minimized") {
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "flex items-center justify-center p-3", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      Button,
      {
        size: "icon",
        className: "h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all",
        style: {
          backgroundColor: "#E8EEFF",
          border: "2px solid #D0D9FF"
        },
        onClick: () => setViewState("collapsed"),
        children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("img", { src: assistantIcon || "/placeholder.svg", alt: "AI Assistant", className: "h-7 w-7" })
      }
    ) });
  }
  if (viewState === "collapsed") {
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "p-3", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      "div",
      {
        className: "rounded-2xl shadow-lg transition-all p-1",
        style: {
          background: "linear-gradient(135deg, #E8EEFF 0%, #F0F4FF 100%)",
          border: "2px solid #D0D9FF"
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex items-center gap-3 px-4 py-3 bg-white rounded-xl", children: [
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("img", { src: assistantIcon || "/placeholder.svg", alt: "AI Assistant", className: "h-8 w-8 flex-shrink-0" }),
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
            Input,
            {
              value: inputValue,
              onChange: (e) => setInputValue(e.target.value),
              onKeyPress: handleKeyPress,
              onFocus: () => setViewState("expanded"),
              placeholder,
              className: "flex-1 border-0 bg-transparent focus-visible:ring-0 text-gray-600"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
              Button,
              {
                size: "icon",
                variant: "ghost",
                className: "h-8 w-8 rounded-lg hover:bg-gray-100",
                onClick: () => setViewState("minimized"),
                children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react11.Minimize2, { className: "h-4 w-4 text-gray-500" })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
              Button,
              {
                size: "icon",
                variant: "ghost",
                className: "h-8 w-8 rounded-lg hover:bg-gray-100",
                onClick: () => setViewState("fullscreen"),
                children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react11.Maximize2, { className: "h-4 w-4 text-gray-500" })
              }
            )
          ] })
        ] })
      }
    ) });
  }
  if (viewState === "fullscreen") {
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Dialog, { open: true, onOpenChange: () => setViewState("expanded"), children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DialogContent, { className: "max-w-6xl h-[85vh] p-0 gap-0 bg-white", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(ChatInterface, { isFullscreen: true }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "h-[500px] border-t border-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
    "div",
    {
      className: "h-full",
      style: {
        background: "linear-gradient(135deg, #E8EEFF 0%, #F0F4FF 100%)"
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(ChatInterface, { isFullscreen: false })
    }
  ) });
};

// components/policy-acceptance-dashboard.tsx
var import_jsx_runtime21 = require("react/jsx-runtime");
var PolicyAcceptanceDashboard = ({
  policyId,
  initialVersion,
  onAcceptComplete,
  aiAssistant
}) => {
  const { policies, acceptPolicy, config, currentUser } = usePolicyAcceptance();
  const [selectedPolicyId, setSelectedPolicyId] = (0, import_react6.useState)("");
  const [hasReadPolicy, setHasReadPolicy] = (0, import_react6.useState)(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = (0, import_react6.useState)(false);
  const [selectedTab, setSelectedTab] = (0, import_react6.useState)("current");
  const [viewingVersion, setViewingVersion] = (0, import_react6.useState)("");
  const [compareVersions2, setCompareVersions] = (0, import_react6.useState)(null);
  const [acceptanceType, setAcceptanceType] = (0, import_react6.useState)("individual");
  const [companyInfo, setCompanyInfo] = (0, import_react6.useState)({
    companyName: "",
    acceptorName: "",
    acceptorTitle: "",
    acceptorEmail: ""
  });
  const [hasAuthority, setHasAuthority] = (0, import_react6.useState)(false);
  const getEarliestUnacceptedPolicy = () => {
    for (const policy of policies) {
      const reversedVersions = [...policy.versions].reverse();
      for (const version of reversedVersions) {
        const isAccepted = policy.userAcceptances.some(
          (a) => a.userId === currentUser.id && a.version === version.version && a.isValid
        );
        if (!isAccepted) {
          return policy.id;
        }
      }
    }
    return policies[0]?.id;
  };
  (0, import_react6.useEffect)(() => {
    if (policyId) {
      setSelectedPolicyId(policyId);
    } else {
      const earliestPolicy = getEarliestUnacceptedPolicy();
      setSelectedPolicyId(earliestPolicy || policies[0]?.id || "");
    }
    if (initialVersion) {
      setViewingVersion(initialVersion);
      setSelectedTab("view");
    } else {
      setSelectedTab("current");
    }
    setHasReadPolicy(false);
    setIsScrolledToBottom(false);
    setCompareVersions(null);
  }, [policyId, initialVersion, policies]);
  (0, import_react6.useEffect)(() => {
    setHasReadPolicy(false);
    setIsScrolledToBottom(false);
    setSelectedTab("current");
    setViewingVersion("");
    setCompareVersions(null);
  }, [selectedPolicyId]);
  const policyData = policies.find((p) => p.id === selectedPolicyId);
  if (!policyData) {
    return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "container mx-auto p-6", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(CardContent, { className: "pt-6", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "text-center text-muted-foreground", children: [
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react12.FileText, { className: "h-12 w-12 mx-auto mb-2 opacity-50" }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { children: "No policy data available." })
    ] }) }) }) });
  }
  const currentVersion = policyData.versions[0];
  const previousVersion = policyData.versions[1];
  const isCurrentAccepted = policyData.userAcceptances.some(
    (a) => a.userId === currentUser.id && a.version === currentVersion.version && a.isValid
  );
  const needsAcceptance = !isCurrentAccepted;
  const versionAcceptanceCheck = canAcceptVersion2(policyData, currentVersion.version, currentUser.id);
  const canAcceptCurrentVersion = versionAcceptanceCheck.canAccept;
  const handleScrollChange = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    setIsScrolledToBottom(isAtBottom);
  };
  const handleViewVersion = (version) => {
    setViewingVersion(version);
    setSelectedTab("view");
  };
  const handleCompareVersions = (current, previous) => {
    setCompareVersions({ current, previous });
    setSelectedTab("compare");
  };
  const isCompanyFormValid = acceptanceType === "individual" || companyInfo.companyName.trim() !== "" && companyInfo.acceptorName.trim() !== "" && companyInfo.acceptorTitle.trim() !== "" && companyInfo.acceptorEmail.trim() !== "" && hasAuthority;
  const canAccept = hasReadPolicy && isScrolledToBottom && needsAcceptance && isCompanyFormValid && canAcceptCurrentVersion;
  const getVersionByNumber = (version) => {
    return policyData.versions.find((v) => v.version === version);
  };
  const handleAccept = async () => {
    await acceptPolicy(
      policyData.id,
      currentVersion.version,
      acceptanceType,
      acceptanceType === "company" ? companyInfo : void 0
    );
    onAcceptComplete?.();
  };
  const handleDecline = () => {
    config.callbacks.onDecline?.(policyData.id);
  };
  const getVisibleAcceptances = () => {
    if (config.organization.whoCanAcceptForCompany !== "any-user") {
      return policyData.userAcceptances;
    } else {
      return policyData.userAcceptances.filter((acceptance) => acceptance.acceptanceType === "individual");
    }
  };
  const visibleAcceptances = getVisibleAcceptances();
  const shouldShowAcceptanceForm = selectedTab === "current" && needsAcceptance;
  const viewingVersionAcceptance = viewingVersion ? visibleAcceptances.find((a) => a.version === viewingVersion) : null;
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(import_jsx_runtime21.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "container mx-auto p-6 max-w-5xl", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(CardHeader, { className: "border-b", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex items-center gap-3", children: [
        needsAcceptance ? /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react12.AlertTriangle, { className: "h-6 w-6 text-amber-500 flex-shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react12.FileText, { className: "h-6 w-6 text-blue-500 flex-shrink-0" }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex-1", children: [
          policies.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "mb-3", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(Select, { value: selectedPolicyId, onValueChange: setSelectedPolicyId, children: [
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(SelectTrigger, { className: "w-full max-w-md", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(SelectValue, { placeholder: "Select a policy" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(SelectContent, { children: policies.map((policy) => {
              const policyTypeInfo = getPolicyTypeInfo(policy.type);
              const currentVer = policy.versions[0];
              const isAccepted = policy.userAcceptances.some(
                (a) => a.userId === currentUser.id && a.version === currentVer.version && a.isValid
              );
              return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(SelectItem, { value: policy.id, children: /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { children: policy.title }),
                /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(Badge, { variant: isAccepted ? "secondary" : "destructive", className: "text-xs", children: [
                  "v",
                  currentVer.version
                ] }),
                !isAccepted && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "text-xs text-amber-600", children: "\u2022 Pending" })
              ] }) }, policy.id);
            }) })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(CardTitle, { className: "text-xl", children: [
            policyData.title,
            needsAcceptance && " - Update Required"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "mt-1 flex items-center gap-2 flex-wrap text-sm text-muted-foreground", children: [
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { children: needsAcceptance ? "Please review and accept the latest version to continue." : "You're up to date with the current policy version." }),
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
              VersionBadge,
              {
                version: currentVersion.version,
                isAccepted: isCurrentAccepted,
                isCurrent: true,
                isBreaking: currentVersion.isBreaking
              }
            )
          ] }),
          currentVersion.deadline && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "mt-2", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(DeadlineIndicator, { deadline: currentVersion.deadline, isAccepted: isCurrentAccepted }) }),
          !canAcceptCurrentVersion && versionAcceptanceCheck.reason && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("p", { className: "text-sm text-amber-800 flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react12.AlertTriangle, { className: "h-4 w-4 flex-shrink-0" }),
            versionAcceptanceCheck.reason
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(CardContent, { className: "pt-6", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(Tabs, { value: selectedTab, onValueChange: setSelectedTab, className: "w-full", children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(TabsList, { className: "grid w-full grid-cols-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(TabsTrigger, { value: "current", className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react12.FileText, { className: "h-4 w-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "hidden sm:inline", children: "Current" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(TabsTrigger, { value: "changes", className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react12.GitCompare, { className: "h-4 w-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "hidden sm:inline", children: "Changes" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(TabsTrigger, { value: "history", className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react12.History, { className: "h-4 w-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "hidden sm:inline", children: "History" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(TabsTrigger, { value: "view", disabled: !viewingVersion, className: "text-xs", children: viewingVersion ? `v${viewingVersion}` : "View" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "mt-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(TabsContent, { value: "current", className: "space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "bg-muted/50 rounded-lg p-4", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex justify-between items-center text-sm", children: [
              /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("span", { className: "font-medium", children: [
                "Version ",
                currentVersion.version
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("span", { className: "text-muted-foreground", children: [
                "Released: ",
                currentVersion.date
              ] })
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(ScrollArea, { className: "h-64 w-full border rounded-md p-4", onScrollCapture: handleScrollChange, children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "text-sm leading-relaxed whitespace-pre-wrap", children: currentVersion.content }) }),
            !isScrolledToBottom && needsAcceptance && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { className: "text-xs text-muted-foreground text-center", children: "Please scroll to the bottom to continue" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(TabsContent, { value: "changes", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(PolicyDiff, { currentVersion, previousVersion }) }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(TabsContent, { value: "history", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "h-96", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
            VersionHistory,
            {
              versions: policyData.versions,
              acceptances: visibleAcceptances,
              currentVersion: currentVersion.version,
              onViewVersion: handleViewVersion,
              onCompareVersions: handleCompareVersions,
              policyType: policyData.type
            }
          ) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(TabsContent, { value: "view", children: viewingVersion && /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "bg-muted/50 rounded-lg p-4", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex justify-between items-center text-sm", children: [
              /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("span", { className: "font-medium", children: [
                "Version ",
                viewingVersion
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("span", { className: "text-muted-foreground", children: [
                "Released: ",
                getVersionByNumber(viewingVersion)?.date
              ] })
            ] }) }),
            viewingVersionAcceptance && /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(CardTitle, { className: "text-lg flex items-center gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react12.FileText, { className: "h-5 w-5" }),
                "Acceptance Information"
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(CardContent, { className: "space-y-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex items-center gap-3", children: [
                    viewingVersionAcceptance.acceptanceType === "company" ? /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react12.Building2, { className: "h-5 w-5 text-blue-600" }) : /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react12.User, { className: "h-5 w-5 text-green-600" }),
                    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "font-medium", children: viewingVersionAcceptance.acceptanceType === "company" ? "Company Acceptance" : "Individual Acceptance" }),
                      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "text-sm text-muted-foreground", children: "Acceptance Type" })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react12.Calendar, { className: "h-5 w-5 text-gray-600" }),
                    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "font-medium", children: new Date(viewingVersionAcceptance.acceptedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      }) }),
                      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "text-sm text-muted-foreground", children: new Date(viewingVersionAcceptance.acceptedAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit"
                      }) })
                    ] })
                  ] })
                ] }),
                viewingVersionAcceptance.acceptanceType === "company" && viewingVersionAcceptance.companyInfo && /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "border-t pt-4 space-y-3", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("h4", { className: "font-medium text-gray-900", children: "Company Details" }),
                  /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "font-medium text-gray-700", children: "Company:" }),
                      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "text-gray-600", children: viewingVersionAcceptance.companyInfo.companyName })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "font-medium text-gray-700", children: "Accepted by:" }),
                      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "text-gray-600", children: viewingVersionAcceptance.companyInfo.acceptorTitle })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "md:col-span-2", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "font-medium text-gray-700", children: "Contact:" }),
                      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "text-gray-600", children: viewingVersionAcceptance.companyInfo.acceptorEmail })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "border-t pt-4", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex items-center gap-2 text-sm text-green-600", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react12.Clock, { className: "h-4 w-4" }),
                  /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("span", { children: [
                    "Accepted",
                    " ",
                    Math.floor(
                      ((/* @__PURE__ */ new Date()).getTime() - new Date(viewingVersionAcceptance.acceptedAt).getTime()) / (1e3 * 60 * 60 * 24)
                    ),
                    " ",
                    "days ago"
                  ] })
                ] }) })
              ] })
            ] }),
            !viewingVersionAcceptance && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(CardContent, { className: "pt-6", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "text-center text-muted-foreground", children: [
              /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react12.FileText, { className: "h-12 w-12 mx-auto mb-2 opacity-50" }),
              /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { children: "This version has not been accepted yet." })
            ] }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(ScrollArea, { className: "h-64 w-full border rounded-md p-4", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "text-sm leading-relaxed whitespace-pre-wrap", children: getVersionByNumber(viewingVersion)?.content }) })
          ] }) })
        ] })
      ] }) })
    ] }) }),
    aiAssistant && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(AIAssistantBar, { config: aiAssistant })
  ] });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AIAssistantBar,
  CompanyAcceptanceForm,
  DeadlineIndicator,
  PolicyAcceptanceContext,
  PolicyAcceptanceDashboard,
  PolicyAcceptanceModal,
  PolicyAcceptanceProvider,
  PolicyDiff,
  PolicyVersioningDemo,
  VersionBadge,
  VersionHistory,
  calculateDaysUntilDeadline,
  canAcceptVersion,
  canUserAcceptForCompany,
  compareVersions,
  createCompany,
  createCompanyOnlyConfig,
  createHybridConfig,
  createIndividualOnlyConfig,
  createPolicyData,
  createUser,
  formatAcceptanceDate,
  generateSampleCompanies,
  generateSamplePolicies,
  generateSampleUsers,
  getPolicyAcceptanceStatus,
  getPolicyTypeInfo,
  getRequiredPolicies,
  getUserAcceptances,
  isVersionOverdue,
  usePolicyAcceptance,
  validateCompany,
  validatePolicyVersion,
  validateUser
});
