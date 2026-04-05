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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center gap-3 text-blue-600 font-bold text-3xl">
              CleanStreet
            </div>

            {/* Role-based Navigation */}
            <div className="flex items-center gap-8 text-sm font-medium">
              <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
              <Link href="/report" className="hover:text-blue-600">Report Issue</Link>
              <Link href="/complaints" className="hover:text-blue-600">View Complaints</Link>

              {/* Volunteer Menu */}
              {user?.role === 'VOLUNTEER' && (
                <Link href="/volunteer" className="hover:text-blue-600 font-medium text-green-600">
                  Volunteer Dashboard
                </Link>
              )}

              {/* Admin Menu */}
              {user?.role === 'ADMIN' && (
                <Link href="/admin" className="hover:text-blue-600 font-medium text-purple-600">
                  Admin Panel
                </Link>
              )}
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                      {user.role}
                    </span>
                  </div>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link href="/login" className="px-6 py-2 text-blue-600 font-medium">Login</Link>
                  <Link href="/register" className="px-6 py-2 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700">
                    Register
                  </Link>
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