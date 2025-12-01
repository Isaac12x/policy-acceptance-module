import type { PolicyVersion, PolicyData } from "../types";

/**
 * Downloads a policy version as a text file
 */
export function downloadPolicy(
  policy: PolicyData,
  version: PolicyVersion,
  format: "txt" | "pdf" | "markdown" = "txt"
): void {
  const fileName = `${policy.title.replace(/\s+/g, "_")}_v${version.version}.${
    format === "markdown" ? "md" : format
  }`;

  let content = "";

  if (format === "markdown") {
    content = `# ${policy.title}\n\n**Version:** ${version.version}\n**Date:** ${version.date}\n\n${version.content}`;
  } else {
    content = `${policy.title}\nVersion: ${version.version}\nReleased: ${version.date}\n\n${version.content}`;
  }

  const blob = new Blob([content], {
    type: format === "pdf" ? "application/pdf" : "text/plain",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Prints a policy version
 */
export function printPolicy(policy: PolicyData, version: PolicyVersion): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to print policies");
    return;
  }

  const content = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${policy.title} - v${version.version}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          h1 {
            color: #1a1a1a;
            border-bottom: 2px solid #e5e5e5;
            padding-bottom: 10px;
          }
          .metadata {
            color: #666;
            font-size: 14px;
            margin: 20px 0;
          }
          .content {
            white-space: pre-wrap;
            margin-top: 30px;
          }
          @media print {
            body {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <h1>${policy.title}</h1>
        <div class="metadata">
          <strong>Version:</strong> ${version.version}<br>
          <strong>Released:</strong> ${version.date}<br>
          ${
            version.deadline
              ? `<strong>Deadline:</strong> ${version.deadline}<br>`
              : ""
          }
          <strong>Printed:</strong> ${new Date().toLocaleString()}
        </div>
        <div class="content">${version.content}</div>
      </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

/**
 * Prints a policy diff comparison
 */
export function printPolicyDiff(
  policy: PolicyData,
  currentVersion: PolicyVersion,
  previousVersion?: PolicyVersion
): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to print policy comparisons");
    return;
  }

  let diffHtml = "";

  if (!previousVersion) {
    diffHtml = `<div style="background: #f0fdf4; padding: 15px; border-left: 4px solid #22c55e; margin: 10px 0;">
      <strong style="color: #166534;">New Policy</strong>
      <pre style="white-space: pre-wrap; margin-top: 10px;">${currentVersion.content}</pre>
    </div>`;
  } else {
    const currentLines = currentVersion.content.split("\n");
    const previousLines = previousVersion.content.split("\n");

    diffHtml = currentLines
      .map((line, index) => {
        const previousLine = previousLines[index];

        if (!previousLine) {
          return `<div style="background: #f0fdf4; padding: 8px; border-left: 4px solid #22c55e; margin: 5px 0;">
          <span style="color: #166534; font-family: monospace;">+ </span>${line}
        </div>`;
        }

        if (line !== previousLine) {
          return `
          <div style="background: #fef2f2; padding: 8px; border-left: 4px solid #ef4444; margin: 5px 0;">
            <span style="color: #991b1b; font-family: monospace;">- </span>
            <span style="text-decoration: line-through;">${previousLine}</span>
          </div>
          <div style="background: #f0fdf4; padding: 8px; border-left: 4px solid #22c55e; margin: 5px 0;">
            <span style="color: #166534; font-family: monospace;">+ </span>${line}
          </div>
        `;
        }

        return `<div style="padding: 8px; margin: 5px 0;">${line}</div>`;
      })
      .join("");
  }

  const content = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${policy.title} - Version Comparison</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            padding: 40px;
            max-width: 900px;
            margin: 0 auto;
          }
          h1 {
            color: #1a1a1a;
            border-bottom: 2px solid #e5e5e5;
            padding-bottom: 10px;
          }
          .comparison-header {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
          }
          .version-badge {
            display: inline-block;
            background: #e0e0e0;
            padding: 4px 12px;
            border-radius: 4px;
            margin: 0 5px;
            font-weight: 600;
          }
          @media print {
            body {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <h1>${policy.title} - Version Comparison</h1>
        <div class="comparison-header">
          <strong>Comparing:</strong>
          ${
            previousVersion
              ? `<span class="version-badge">v${previousVersion.version}</span> → `
              : ""
          }
          <span class="version-badge">v${currentVersion.version}</span><br>
          <strong>Printed:</strong> ${new Date().toLocaleString()}
        </div>
        <div style="margin-top: 30px;">
          ${diffHtml}
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

/**
 * Downloads a policy diff comparison as a text file
 */
export function downloadPolicyDiff(
  policy: PolicyData,
  currentVersion: PolicyVersion,
  previousVersion?: PolicyVersion
): void {
  const fileName = `${policy.title.replace(/\s+/g, "_")}_comparison_v${
    previousVersion?.version || "new"
  }_to_v${currentVersion.version}.txt`;

  let content = `${policy.title} - Version Comparison\n`;
  content += `${"=".repeat(50)}\n\n`;

  if (previousVersion) {
    content += `Comparing: v${previousVersion.version} → v${currentVersion.version}\n\n`;
  } else {
    content += `New Policy: v${currentVersion.version}\n\n`;
  }

  content += `Generated: ${new Date().toLocaleString()}\n\n`;
  content += `${"=".repeat(50)}\n\n`;

  if (!previousVersion) {
    content += `NEW CONTENT:\n${currentVersion.content}`;
  } else {
    const currentLines = currentVersion.content.split("\n");
    const previousLines = previousVersion.content.split("\n");

    currentLines.forEach((line, index) => {
      const previousLine = previousLines[index];

      if (!previousLine) {
        content += `+ ${line}\n`;
      } else if (line !== previousLine) {
        content += `- ${previousLine}\n`;
        content += `+ ${line}\n`;
      } else {
        content += `  ${line}\n`;
      }
    });
  }

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
