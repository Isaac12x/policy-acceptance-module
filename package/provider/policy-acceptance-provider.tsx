"use client"

import type React from "react"
import { createContext, useState, useEffect, type ReactNode } from "react"
import type {
  PolicyData,
  PolicyAcceptanceConfig,
  PolicyAcceptanceContextType,
  AcceptanceType,
  CompanyInfo,
  User,
  Company,
} from "../types"
import { canUserAcceptForCompany, getPolicyAcceptanceStatus, getRequiredPolicies, getUserAcceptances } from "../utils"

export const PolicyAcceptanceContext = createContext<PolicyAcceptanceContextType | null>(null)

interface PolicyAcceptanceProviderProps {
  children: ReactNode
  config: PolicyAcceptanceConfig
}

export const PolicyAcceptanceProvider: React.FC<PolicyAcceptanceProviderProps> = ({ children, config }) => {
  const [policies, setPolicies] = useState<PolicyData[]>(config.dataSource.localData?.policies || [])
  const [users, setUsers] = useState<User[]>(config.dataSource.localData?.users || [])
  const [companies, setCompanies] = useState<Company[]>(config.dataSource.localData?.companies || [])
  const [currentPolicy, setCurrentPolicy] = useState<PolicyData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentUser = config.currentUser
  const currentCompany = config.currentCompany

  const refreshData = async () => {
    if (config.dataSource.type === "local") {
      return // Use local state only
    }

    if (!config.dataSource.apiEndpoints?.getPolicies) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(config.dataSource.apiEndpoints.getPolicies)
      if (!response.ok) {
        throw new Error(`Failed to fetch policies: ${response.statusText}`)
      }

      const data = await response.json()
      setPolicies(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      config.callbacks.onError?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }

  const acceptPolicy = async (
    policyId: string,
    version: string,
    acceptanceType: AcceptanceType,
    companyInfo?: CompanyInfo,
  ) => {
    const acceptance = {
      id: `acceptance-${Date.now()}`,
      policyId,
      version,
      userId: currentUser.id,
      acceptedAt: new Date().toISOString(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      acceptanceType,
      companyInfo,
      isValid: true,
    }

    // Call beforeAcceptance hook if provided
    if (config.callbacks.beforeAcceptance) {
      const shouldProceed = await config.callbacks.beforeAcceptance(acceptance)
      if (!shouldProceed) {
        return
      }
    }

    // If API endpoint is provided, submit to server
    if (config.dataSource.apiEndpoints?.submitAcceptance) {
      setIsLoading(true)
      try {
        const response = await fetch(config.dataSource.apiEndpoints.submitAcceptance, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(acceptance),
        })

        if (!response.ok) {
          throw new Error(`Failed to submit acceptance: ${response.statusText}`)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to submit acceptance"
        setError(errorMessage)
        config.callbacks.onError?.(err instanceof Error ? err : new Error(errorMessage), "acceptPolicy")
        return
      } finally {
        setIsLoading(false)
      }
    }

    // Update local state
    setPolicies((prevPolicies) =>
      prevPolicies.map((policy) =>
        policy.id === policyId
          ? {
              ...policy,
              userAcceptances: [...policy.userAcceptances, acceptance],
            }
          : policy,
      ),
    )

    // Call callbacks
    config.callbacks.onAcceptance?.(acceptance)
    config.integrations?.analytics?.trackAcceptance?.(acceptance)
    config.integrations?.audit?.logAction?.("policy_accepted", acceptance)
  }

  const declinePolicy = async (policyId: string, reason?: string) => {
    const declineData = {
      policyId,
      userId: currentUser.id,
      declinedAt: new Date().toISOString(),
      reason,
    }

    config.callbacks.onDecline?.(policyId, reason)
    config.integrations?.analytics?.trackDecline?.(declineData)
    config.integrations?.audit?.logAction?.("policy_declined", declineData)
  }

  const canUserAcceptForCompanyFn = (userId: string, companyId?: string) => {
    const user = users.find((u) => u.id === userId)
    const company = companies.find((c) => c.id === (companyId || user?.companyId))

    if (!user || !company) return false

    return canUserAcceptForCompany(user, company, config.organization)
  }

  const getPolicyAcceptanceStatusFn = (policyId: string, userId?: string) => {
    const policy = policies.find((p) => p.id === policyId)
    const user = users.find((u) => u.id === (userId || currentUser.id))

    if (!policy || !user) return "not-required"

    return getPolicyAcceptanceStatus(policy, user, config.organization)
  }

  const getRequiredPoliciesFn = (userId?: string) => {
    const user = users.find((u) => u.id === (userId || currentUser.id))
    if (!user) return []

    return getRequiredPolicies(policies, user, config.organization)
  }

  const getUserAcceptancesFn = (userId?: string) => {
    const targetUserId = userId || currentUser.id
    return getUserAcceptances(policies, targetUserId)
  }

  useEffect(() => {
    if (config.dataSource.type === "api" && config.dataSource.apiEndpoints?.getPolicies) {
      refreshData()
    }
  }, [config.dataSource.apiEndpoints?.getPolicies])

  const contextValue: PolicyAcceptanceContextType = {
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
    getUserAcceptances: getUserAcceptancesFn,
  }

  return <PolicyAcceptanceContext.Provider value={contextValue}>{children}</PolicyAcceptanceContext.Provider>
}
