"use client"

import { useContext } from "react"
import { PolicyAcceptanceContext } from "../provider/policy-acceptance-provider"
import type { PolicyAcceptanceContextType } from "../types"

export const usePolicyAcceptance = (): PolicyAcceptanceContextType => {
  const context = useContext(PolicyAcceptanceContext)

  if (!context) {
    throw new Error("usePolicyAcceptance must be used within a PolicyAcceptanceProvider")
  }

  return context
}
