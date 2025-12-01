# Policy Diff Component Documentation

## Overview

The `PolicyDiff` component provides a visual comparison between two policy versions, highlighting additions, deletions, and modifications. It performs line-by-line text comparison to show users exactly what has changed between policy versions.

## Import

```typescript
import { PolicyDiff } from "@fortisvincere/policy-acceptance-module";
```

## Props Interface

```typescript
import type { PolicyVersion } from "@fortisvincere/policy-acceptance-module";

interface PolicyDiffProps {
  currentVersion: PolicyVersion; // Required: The newer/current version
  previousVersion?: PolicyVersion; // Optional: The older version to compare against
}
```

## PolicyVersion Object Structure

The `PolicyVersion` type is exported from the package:

```typescript
import type { PolicyVersion } from "@fortisvincere/policy-acceptance-module";

// PolicyVersion includes:
// - id: string - Unique identifier for the version
// - version: string - Version number (e.g., "1.0", "2.0", "3.0")
// - date: string - Release date (ISO format or display format)
// - content: string - The actual policy text content
// - changes?: string[] - Optional: Array of change summaries
// - isBreaking?: boolean - Optional: Whether this is a breaking change
// - deadline?: string - Optional: Acceptance deadline date
// - effectiveDate?: string - Optional: When the policy takes effect
```

## Usage Examples

### Basic Usage

```tsx
import { PolicyDiff } from "@fortisvincere/policy-acceptance-module";

// Example policy versions
const previousVersion = {
  id: "privacy-v1",
  version: "1.0",
  date: "2024-01-01",
  content: `Privacy Policy
  We collect your data.
  We protect your information.
  Contact us at support@example.com`
}

const currentVersion = {
  id: "privacy-v2",
  version: "2.0",
  date: "2025-01-01",
  content: `Privacy Policy
  We collect your personal data.
  We protect your information with encryption.
  We share data with partners.
  Contact us at privacy@example.com`,
  changes: [
  "Added encryption details",
  "Added data sharing disclosure",
  "Updated contact email"
  ],
  isBreaking: true,
  deadline: "2025-12-31"
}

// Render the diff
<PolicyDiff
  currentVersion={currentVersion}
  previousVersion={previousVersion}
/>
```

### Without Previous Version (New Policy)

``tsx
// When there's no previous version, all content is shown as new
<PolicyDiff 
  currentVersion={newPolicy}
  previousVersion={undefined}
/>

```

## Diff Logic Explained

### 1. No Previous Version

When `previousVersion` is undefined or not provided:

- All content is displayed with **green highlighting** and `+` prefix
- Indicates this is a completely new policy

### 2. With Previous Version

When both versions are provided, line-by-line comparison is performed:

#### Line States:

- **Added Lines** (Green with `+`): Content that exists in current but not in previous
- **Removed Lines** (Red with `-`): Content that existed in previous but not in current
- **Unchanged Lines** (Gray): Content that is identical in both versions
- **Modified Lines**: Shown as removed (red) followed by added (green)

### 3. Changes Summary

If `currentVersion.changes` array is provided:

- Displays a bullet-point summary at the top of the diff
- Shows high-level overview of what changed
- Useful for quick scanning before reading detailed diff

## Visual Indicators

### Color Coding

```

Green background (#dcfce7) = Added content
Red background (#fee2e2) = Removed content
Gray text = Unchanged content

````

### Icons

- `+` prefix = Added line
- `-` prefix = Removed line
- No prefix = Unchanged line

### Badges

- Version badges show the version numbers being compared
- Breaking change indicator if `isBreaking: true`

## Implementation Details

### Line-by-Line Comparison Algorithm

```typescript
// Simplified version of the comparison logic
const previousLines = previousVersion?.content.split('\n') || []
const currentLines = currentVersion.content.split('\n')

// For each line in current version:
// 1. Check if it exists in previous version
// 2. If yes → unchanged (gray)
// 3. If no → added (green)

// For each line in previous version:
// 1. Check if it exists in current version
// 2. If no → removed (red)
````

### Performance Considerations

- Simple string comparison (O(n\*m) complexity)
- For large policy documents (>1000 lines), consider using a proper diff library
- Recommended libraries for production:
  - `diff` - Fast text diffing algorithm
  - `react-diff-viewer` - React component with advanced features
  - `diff-match-patch` - Google's diff algorithm

## Integration with Policy Acceptance Modal

The `PolicyDiff` component is used within the `PolicyAcceptanceModal`:

```tsx
import {
  PolicyDiff,
  PolicyAcceptanceModal,
} from "@fortisvincere/policy-acceptance-module";

// The PolicyAcceptanceModal automatically uses PolicyDiff internally
<PolicyAcceptanceModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  policyId={policyId}
/>;
```

The modal automatically:

1. Finds the previous version from the policy's version history
2. Passes both versions to the diff component
3. Displays the diff in a scrollable container
4. Tracks scroll position for acceptance validation

## Customization

### Styling

The component uses Tailwind CSS classes. Key classes to customize:

```tsx
// Added lines
className = "bg-green-50 border-l-2 border-green-500";

// Removed lines
className = "bg-red-50 border-l-2 border-red-500";

// Unchanged lines
className = "text-muted-foreground";
```

### Content Format

The `content` field should be:

- Plain text with line breaks (`\n`)
- Markdown (will be rendered as plain text)
- HTML (will be rendered as plain text)

For rich text comparison, you'll need to:

1. Parse the HTML/Markdown to plain text
2. Perform the diff
3. Re-apply formatting to the diff results

## Example: Creating Policy Versions for Diff

```typescript
import type { PolicyVersion } from "@fortisvincere/policy-acceptance-module";

// Helper function to create policy versions
function createPolicyVersion(
id: string,
version: string,
content: string,
changes?: string[]
): PolicyVersion {
return {
id,
version,
date: new Date().toISOString(),
content,
changes,
isBreaking: changes && changes.length > 0,
}
}

// Usage
const v1 = createPolicyVersion(
"terms-v1",
"1.0",
`Terms of Service
You must be 18 years old.
We may terminate your account.`
)

const v2 = createPolicyVersion(
"terms-v2",
"2.0",
`Terms of Service
You must be 18 years or older.
We may suspend or terminate your account.
You agree to arbitration.`,
[
"Clarified age requirement",
"Added suspension option",
"Added arbitration clause"
]
)

<PolicyDiff currentVersion={v2} previousVersion={v1} />
```

## Best Practices

1. **Always provide changes summary**: Include the `changes` array for better UX
2. **Keep content line-based**: Format policy content with clear line breaks
3. **Version numbering**: Use semantic versioning (major.minor.patch)
4. **Breaking changes**: Set `isBreaking: true` for significant changes
5. **Deadlines**: Include `deadline` for time-sensitive policy updates
6. **Testing**: Test with various content lengths and change types

## Limitations

1. **Simple diff algorithm**: Uses basic string comparison, not optimal for large texts
2. **No word-level diff**: Shows line-level changes only
3. **No syntax highlighting**: Treats all content as plain text
4. **Memory usage**: Loads both full versions into memory
5. **No conflict resolution**: Assumes linear version history

## Future Enhancements

Consider these improvements for production use:

1. **Advanced diff library**: Integrate `diff` or `react-diff-viewer`
2. **Word-level highlighting**: Show changes within lines
3. **Syntax highlighting**: Support for markdown/HTML formatting
4. **Side-by-side view**: Option for split-pane comparison
5. **Collapse unchanged**: Hide unchanged sections for long documents
6. **Search in diff**: Find specific changes quickly
7. **Export diff**: Download comparison as PDF or HTML

## Troubleshooting

### Diff not showing changes

- Ensure `content` fields are different between versions
- Check for whitespace differences (trailing spaces, tabs vs spaces)
- Verify line breaks are consistent (`\n` vs `\r\n`)

### Performance issues

- Limit content length or paginate large documents
- Use a more efficient diff algorithm
- Implement virtual scrolling for long diffs

### Styling issues

- Check Tailwind CSS configuration
- Verify color classes are not being purged
- Ensure proper contrast ratios for accessibility

```

```
