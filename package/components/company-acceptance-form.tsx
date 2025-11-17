"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Building2, User, AlertTriangle } from "lucide-react"
import type { AcceptanceType, CompanyInfo } from "../types"

interface CompanyAcceptanceFormProps {
  acceptanceType: AcceptanceType
  onAcceptanceTypeChange: (type: AcceptanceType) => void
  companyInfo: CompanyInfo
  onCompanyInfoChange: (info: CompanyInfo) => void
  hasAuthority: boolean
  onAuthorityChange: (hasAuthority: boolean) => void
  isValid: boolean
}

export function CompanyAcceptanceForm({
  acceptanceType,
  onAcceptanceTypeChange,
  companyInfo,
  onCompanyInfoChange,
  hasAuthority,
  onAuthorityChange,
  isValid,
}: CompanyAcceptanceFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Acceptance Type
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={acceptanceType} onValueChange={onAcceptanceTypeChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="individual" id="individual" />
            <Label htmlFor="individual" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Individual Acceptance
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="company" id="company" />
            <Label htmlFor="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Company/Organization Acceptance
            </Label>
          </div>
        </RadioGroup>

        {acceptanceType === "individual" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              You are accepting this policy as an individual user. This acceptance applies only to your personal use of
              the service.
            </p>
          </div>
        )}

        {acceptanceType === "company" && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  You are accepting this policy on behalf of your organization. Please ensure you have the authority to
                  bind your organization to these terms.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company/Organization Name *</Label>
                <Input
                  id="companyName"
                  value={companyInfo.companyName}
                  onChange={(e) => onCompanyInfoChange({ ...companyInfo, companyName: e.target.value })}
                  placeholder="Enter company name"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="acceptorName">Your Full Name *</Label>
                  <Input
                    id="acceptorName"
                    value={companyInfo.acceptorName}
                    onChange={(e) => onCompanyInfoChange({ ...companyInfo, acceptorName: e.target.value })}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="acceptorTitle">Your Title/Position *</Label>
                  <Input
                    id="acceptorTitle"
                    value={companyInfo.acceptorTitle}
                    onChange={(e) => onCompanyInfoChange({ ...companyInfo, acceptorTitle: e.target.value })}
                    placeholder="e.g., CEO, Legal Counsel, CTO"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="acceptorEmail">Your Email Address *</Label>
                <Input
                  id="acceptorEmail"
                  type="email"
                  value={companyInfo.acceptorEmail}
                  onChange={(e) => onCompanyInfoChange({ ...companyInfo, acceptorEmail: e.target.value })}
                  placeholder="your.email@company.com"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox id="authority" checked={hasAuthority} onCheckedChange={onAuthorityChange} className="mt-1" />
                <Label htmlFor="authority" className="text-sm leading-relaxed">
                  I confirm that I have the legal authority to bind{" "}
                  <span className="font-medium">{companyInfo.companyName || "my organization"}</span> to these terms and
                  conditions. I understand that this acceptance will apply to all users within our organization who
                  access this service.
                </Label>
              </div>
            </div>

            {!isValid && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  Please fill in all required fields and confirm your authority to proceed.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
