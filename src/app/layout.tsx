import "./globals.css";
import ServiceWorkerRegistration from "@/components/shared/ServiceWorkerRegistration";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Habit Tracker",
    description: "Track daily habits with local-first progress persistence.",
    manifest: "/manifest.json",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ServiceWorkerRegistration />
                {children}
            </body>
        </html>
    )
}
