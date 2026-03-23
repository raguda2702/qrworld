import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata = {
  title: "QR World",
  description: "One QR ecosystem",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <ToastProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                  <Link href="/" className="text-lg font-bold">
                    QR World
                  </Link>
                  <nav className="flex items-center gap-4 text-sm">
                    <Link href="/" className="text-slate-600 hover:text-slate-900">
                      Home
                    </Link>
                    <Link href="/qr" className="text-slate-600 hover:text-slate-900">
                      QR
                    </Link>
                    <Link href="/profile" className="text-slate-600 hover:text-slate-900">
                      Profile
                    </Link>
                    <Link href="/chat" className="text-slate-600 hover:text-slate-900">
                      Chats
                    </Link>
                    <Link href="/scan" className="text-slate-600 hover:text-slate-900">
                      Scan
                    </Link>
                  </nav>
                </div>
              </header>

              <main className="flex-1">{children}</main>

              <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-slate-500">
                  © QR World
                </div>
              </footer>
            </div>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}