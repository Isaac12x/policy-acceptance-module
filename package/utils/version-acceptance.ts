import type { Policy } from "../types"

export interface VersionAcceptanceCheck {
  canAccept: boolean
  reason?: string
}

/**
 * Checks if a user can accept a specific version of a policy.
 * Users must accept versions in order - they cannot skip versions.
 */
export function canAcceptVersion(policy: Policy, version: string, userId: string): VersionAcceptanceCheck {
  // Find the version index
  const versionIndex = policy.versions.findIndex((v) => v.version === version)

  if (versionIndex === -1) {
    return {
      canAccept: false,
      reason: "Version not found",
    }
  }

  // If this is the first version (oldest), it can always be accepted
  if (versionIndex === policy.versions.length - 1) {
    return {
      canAccept: true,
    }
  }

  // Check if all previous versions have been accepted
  const previousVersions = policy.versions.slice(versionIndex + 1)

  for (const prevVersion of previousVersions) {
    const hasAccepted = policy.userAcceptances.some(
      (acceptance) => acceptance.userId === userId && acceptance.version === prevVersion.version && acceptance.isValid,
    )

    if (!hasAccepted) {
      return {
        canAccept: false,
        reason: `You must accept version ${prevVersion.version} before accepting version ${version}`,
      }
    }
  }

  return {
    canAccept: true,
  }
}
