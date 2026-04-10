import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "./components/LogoutButton";
import Link from "next/link";
import { User } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CleanStreet",
  description: "Report & Track Civic Issues",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-blue-600 font-bold text-3xl">
              CleanStreet
            </div>

            <div className="flex items-center gap-8 text-sm font-medium">
              <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
              <Link href="/report" className="hover:text-blue-600">Report Issue</Link>
              <Link href="/complaints" className="hover:text-blue-600">View Complaints</Link>

              {user?.role === 'VOLUNTEER' && (
                <Link href="/volunteer" className="text-green-600 font-medium">Volunteer</Link>
              )}
              {user?.role === 'ADMIN' && (
                <Link href="/admin" className="text-purple-600 font-medium">Admin Panel</Link>
              )}
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs px-3 py-1 bg-gray-100 rounded-full">{user.role}</span>
                  </div>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link href="/login" className="px-6 py-2 text-blue-600 font-medium">Login</Link>
                  <Link href="/register" className="px-6 py-2 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700">Register</Link>
                </>
              )}
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}