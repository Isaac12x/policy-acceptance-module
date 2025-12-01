"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Building2, User, Users, Settings } from "lucide-react";
import {
  PolicyAcceptanceProvider,
  PolicyVersioningDemo,
  createIndividualOnlyConfig,
  createCompanyOnlyConfig,
  createHybridConfig,
  createUser,
  createCompany,
  generateSamplePolicies,
} from "@fv/policy-acceptance-module";
import type {
  User as UserType,
  Company as CompanyType,
  PolicyAcceptanceConfig,
} from "@fv/policy-acceptance-module";

// Sample data for different scenarios
const sampleUsers = {
  individual: createUser(
    "user-001",
    "john@freelance.com",
    "John Smith",
    "user"
  ),
  companyUser: createUser(
    "user-002",
    "jane@acme.com",
    "Jane Doe",
    "user",
    "company-001",
    false
  ),
  companyAdmin: createUser(
    "user-003",
    "admin@acme.com",
    "Admin User",
    "company-admin",
    "company-001",
    true
  ),
};

const sampleCompany = createCompany(
  "company-001",
  "Acme Corporation",
  ["user-003"],
  {
    requireAuthorityConfirmation: true,
    requireTitleAndEmail: true,
    allowDelegatedAcceptance: false,
    notificationEmails: ["legal@acme.com"],
  }
);

const samplePolicies = generateSamplePolicies();

export function createIndividualConfig(): PolicyAcceptanceConfig {
  return createIndividualOnlyConfig(sampleUsers.individual, {
    dataSource: {
      type: "local",
      localData: {
        policies: samplePolicies,
        users: [sampleUsers.individual],
        companies: [],
        currentUser: sampleUsers.individual,
      },
    },
    callbacks: {
      onAcceptance: (acceptance) => {
        console.log("Individual acceptance:", acceptance);
      },
    },
  });
}

export default function OrganizationSetups() {
  const [selectedSetup, setSelectedSetup] = useState<
    "individual" | "company" | "hybrid"
  >("individual");
  const [showDemo, setShowDemo] = useState(false);

  const getConfigForSetup = (): {
    config: PolicyAcceptanceConfig;
    user: UserType;
    company?: CompanyType;
  } => {
    switch (selectedSetup) {
      case "individual":
        return {
          config: createIndividualOnlyConfig(sampleUsers.individual, {
            dataSource: {
              type: "local",
              localData: {
                policies: samplePolicies,
                users: [sampleUsers.individual],
                companies: [],
                currentUser: sampleUsers.individual,
              },
            },
            callbacks: {
              onAcceptance: (acceptance) => {
                console.log("Individual acceptance:", acceptance);
              },
            },
          }),
          user: sampleUsers.individual,
        };

      case "company":
        return {
          config: createCompanyOnlyConfig(
            sampleUsers.companyAdmin,
            sampleCompany,
            {
              dataSource: {
                type: "local",
                localData: {
                  policies: samplePolicies,
                  users: [sampleUsers.companyAdmin, sampleUsers.companyUser],
                  companies: [sampleCompany],
                  currentUser: sampleUsers.companyAdmin,
                },
              },
              callbacks: {
                onAcceptance: (acceptance) => {
                  console.log("Company acceptance:", acceptance);
                },
              },
            }
          ),
          user: sampleUsers.companyAdmin,
          company: sampleCompany,
        };

      case "hybrid":
        return {
          config: createHybridConfig(sampleUsers.companyAdmin, sampleCompany, {
            dataSource: {
              type: "local",
              localData: {
                policies: samplePolicies,
                users: [
                  sampleUsers.companyAdmin,
                  sampleUsers.companyUser,
                  sampleUsers.individual,
                ],
                companies: [sampleCompany],
                currentUser: sampleUsers.companyAdmin,
              },
            },
            callbacks: {
              onAcceptance: (acceptance) => {
                console.log("Hybrid acceptance:", acceptance);
              },
            },
          }),
          user: sampleUsers.companyAdmin,
          company: sampleCompany,
        };
    }
  };

  const { config, user, company } = getConfigForSetup();

  const setupDescriptions = {
    individual: {
      title: "Individual Only",
      description:
        "Users accept policies for themselves only. No company-wide acceptance.",
      icon: User,
      features: [
        "Personal acceptance only",
        "No company authority required",
        "Simple user experience",
        "Individual compliance tracking",
      ],
      useCase: "Freelancers, consultants, personal accounts",
    },
    company: {
      title: "Company Only",
      description:
        "Designated users accept policies on behalf of the entire organization.",
      icon: Building2,
      features: [
        "Company-wide acceptance",
        "Authority confirmation required",
        "Admin/legal team control",
        "Organizational compliance",
      ],
      useCase: "Enterprises, corporations, regulated industries",
    },
    hybrid: {
      title: "Hybrid Model",
      description:
        "Supports both individual and company acceptance based on context.",
      icon: Users,
      features: [
        "Flexible acceptance modes",
        "Role-based permissions",
        "Individual + company tracking",
        "Complex organizational structures",
      ],
      useCase: "Mixed organizations, subsidiaries, flexible teams",
    },
  };

  if (showDemo) {
    return (
      <PolicyAcceptanceProvider config={config}>
        <div className="min-h-screen bg-gray-50">
          <div className="p-4 bg-white border-b">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">
                  {setupDescriptions[selectedSetup].title} Demo
                </h1>
                <p className="text-sm text-muted-foreground">
                  User: {user.name} ({user.email})
                  {company && ` • Company: ${company.name}`}
                </p>
              </div>
              <Button onClick={() => setShowDemo(false)} variant="outline">
                Back to Setup
              </Button>
            </div>
          </div>
          <PolicyVersioningDemo />
        </div>
      </PolicyAcceptanceProvider>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Organization Setup Examples
          </h1>
          <p className="text-lg text-gray-600">
            Choose the policy acceptance model that fits your organization
          </p>
        </div>

        <Tabs
          value={selectedSetup}
          onValueChange={(value) => setSelectedSetup(value as any)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Individual
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Company
            </TabsTrigger>
            <TabsTrigger value="hybrid" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Hybrid
            </TabsTrigger>
          </TabsList>

          {Object.entries(setupDescriptions).map(([key, setup]) => (
            <TabsContent key={key} value={key} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <setup.icon className="h-6 w-6" />
                    {setup.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {setup.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Key Features</h4>
                      <ul className="space-y-2">
                        {setup.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Best For</h4>
                      <p className="text-sm text-muted-foreground">
                        {setup.useCase}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Configuration Preview</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">
                            Company Acceptance:
                          </span>
                          <Badge
                            variant={
                              config.organization.requireCompanyAcceptance
                                ? "default"
                                : "secondary"
                            }
                            className="ml-2"
                          >
                            {config.organization.requireCompanyAcceptance
                              ? "Required"
                              : "Not Required"}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium">
                            Individual Acceptance:
                          </span>
                          <Badge
                            variant={
                              config.organization.allowIndividualAcceptance
                                ? "default"
                                : "secondary"
                            }
                            className="ml-2"
                          >
                            {config.organization.allowIndividualAcceptance
                              ? "Allowed"
                              : "Not Allowed"}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium">
                            Authority Required:
                          </span>
                          <Badge
                            variant={
                              config.organization.requireAuthorityConfirmation
                                ? "destructive"
                                : "secondary"
                            }
                            className="ml-2"
                          >
                            {config.organization.requireAuthorityConfirmation
                              ? "Yes"
                              : "No"}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium">Scope:</span>
                          <Badge variant="outline" className="ml-2">
                            {config.organization.acceptanceScope}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button onClick={() => setShowDemo(true)} size="lg">
                      Try {setup.title} Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Implementation Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">1. Choose Your Model</h4>
                <p className="text-sm text-muted-foreground">
                  Select the acceptance model that matches your organization's
                  structure and compliance needs.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">2. Configure Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Set up user roles, company information, and acceptance
                  requirements based on your chosen model.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">3. Integrate & Deploy</h4>
                <p className="text-sm text-muted-foreground">
                  Use the provided configuration helpers to integrate the policy
                  system into your application.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { OrganizationSetups as OrganizationSetupsDemo };
