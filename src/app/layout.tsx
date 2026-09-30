import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FolderGit2 } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Code Vault",
  description: "Secure and manage your code folders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} min-h-screen bg-black text-foreground antialiased selection:bg-primary selection:text-primary-foreground`}
      >
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
            <a href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                <FolderGit2 className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">CodeVault</span>
            </a>
          </div>
        </header>
        <main className="container mx-auto px-4 md:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
