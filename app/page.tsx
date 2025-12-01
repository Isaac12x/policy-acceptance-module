import Link from "next/link";
export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-12">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-gray-900">
            Policy Acceptance Module
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive, drop-in React package for managing policy
            acceptances in Next.js applications
          </p>

          <div className="pt-8 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                Package Repository
              </h2>
              <p className="text-blue-700 mb-4">
                This is the source code for the Policy Acceptance Module npm
                package.
              </p>
              <div className="bg-white rounded p-4 text-left">
                <code className="text-sm text-gray-800">
                  npm install @fortisvincere/policy-acceptance-module
                </code>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
                <ul className="text-sm text-gray-700 space-y-2 text-left">
                  <li>✓ Modal & Dashboard views</li>
                  <li>✓ Version management</li>
                  <li>✓ AI assistant integration</li>
                  <li>✓ Download & print support</li>
                  <li>✓ TypeScript support</li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Documentation
                </h3>
                <ul className="text-sm text-gray-700 space-y-2 text-left">
                  <li>→ README.md</li>
                  <li>→ PACKAGE-USAGE.md</li>
                  <li>→ docs/policy-diff.md</li>
                  <li>→ docs/ai-assistant-integration.md</li>
                </ul>
              </div>
            </div>

            <div className="pt-6 flex flex-row gap-2 justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  To build the package, run:{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    npm run build
                  </code>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  See the demos in the{" "}
                  <Link
                    href="/demos"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    demos
                  </Link>{" "}
                  page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
