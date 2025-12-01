"use client";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Policy Acceptance Module
          </h1>
          <p className="text-lg text-gray-600">
            Choose a display mode to see the demo
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-3">Popup Modal</h2>
            <p className="text-gray-600 mb-4">
              Display policies in a modal dialog that overlays your application.
              Best for interrupting the user flow to require immediate
              attention.
            </p>
            <Link href="/demo/modal">
              <Button className="w-full">View Modal Demo</Button>
            </Link>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-3">Dashboard View</h2>
            <p className="text-gray-600 mb-4">
              Display policies in a dedicated page or dashboard section. Best
              for settings pages or when users want to review policies at their
              own pace.
            </p>
            <Link href="/demo/dashboard">
              <Button className="w-full">View Dashboard Demo</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
