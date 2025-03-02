import "./globals.css";
import type { Metadata } from "next";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Modals } from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";
import { JotaiProvider } from "@/components/jotai-provider";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export const metadata: Metadata = {
  title: "Collabify",
  description: "Collabify is a real-time team communication platform designed to streamline collaboration and boost productivity. With features like organized channels, direct messaging, file sharing, and customizable notifications, Collabify helps teams stay connected and focused. Its intuitive interface makes it easy to manage projects, share ideas, and make quick decisions—whether you're working remotely or in the office. Designed for teams of all sizes, Collabify ensures that every conversation is seamless, organized, and actionable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body>
          <ConvexClientProvider>
            <JotaiProvider>
              <Toaster />
              <Modals />
              <NuqsAdapter>
                {children}
              </NuqsAdapter>
            </JotaiProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
