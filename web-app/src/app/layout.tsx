import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
config.autoAddCss = false;

export const metadata: Metadata = {
    title: "Parking Monitor App",
    description: "SIT329 Number Plate Identification App",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <Navbar isAdmin={false} isAuthenticated={false} />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
