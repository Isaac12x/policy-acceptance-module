import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { PolicyVersion } from "../types"

interface PolicyDiffProps {
  currentVersion: PolicyVersion
  previousVersion?: PolicyVersion
}

export function PolicyDiff({ currentVersion, previousVersion }: PolicyDiffProps) {
  const renderDiffContent = () => {
    if (!previousVersion) {
      return (
        <div className="space-y-4">
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <h4 className="font-medium text-green-800 mb-2">New Policy</h4>
            <div className="text-sm text-green-700 whitespace-pre-wrap">{currentVersion.content}</div>
          </div>
        </div>
      )
    }

    // Simple diff simulation - in a real app, you'd use a proper diff library
    const currentLines = currentVersion.content.split("\n")
    const previousLines = previousVersion.content.split("\n")

    return (
      <div className="space-y-2">
        {currentLines.map((line, index) => {
          const previousLine = previousLines[index]
          const isNew = !previousLine || line !== previousLine
          const isModified = previousLine && line !== previousLine

          if (isNew && !previousLine) {
            return (
              <div key={index} className="bg-green-50 border-l-4 border-green-400 p-2 rounded">
                <span className="text-xs text-green-600 font-mono">+ </span>
                <span className="text-sm text-green-800">{line}</span>
              </div>
            )
          }

          if (isModified) {
            return (
              <div key={index} className="space-y-1">
                <div className="bg-red-50 border-l-4 border-red-400 p-2 rounded">
                  <span className="text-xs text-red-600 font-mono">- </span>
                  <span className="text-sm text-red-800 line-through">{previousLine}</span>
                </div>
                <div className="bg-green-50 border-l-4 border-green-400 p-2 rounded">
                  <span className="text-xs text-green-600 font-mono">+ </span>
                  <span className="text-sm text-green-800">{line}</span>
                </div>
              </div>
            )
          }

          return (
            <div key={index} className="p-2">
              <span className="text-sm text-gray-700">{line}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Policy Changes</CardTitle>
          <div className="flex gap-2">
            {previousVersion && <Badge variant="outline">From v{previousVersion.version}</Badge>}
            <Badge>To v{currentVersion.version}</Badge>
          </div>
        </div>
        {currentVersion.changes && currentVersion.changes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Summary of Changes:</h4>
            <ul className="text-sm space-y-1">
              {currentVersion.changes.map((change, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full border rounded-md p-4">{renderDiffContent()}</ScrollArea>
      </CardContent>
    </Card>
  )
}
