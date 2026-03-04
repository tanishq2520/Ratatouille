import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ratatouille - AI Recipe Builder",
  description: "Ratatouille is an AI-powered recipe builder for developers.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{baseTheme:neobrutalism}}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Header />
          <main className="flex min-h-screen flex-col">{children}</main>
          <Toaster richColors/>
          <footer className="px-4 py-8 border-t">
            <div className="max-w-7xl mx-auto justify-between items-center ">
              <div className="flex items-center gap-3">
                {/* <Image
                  src="/logo.png"
                  alt="Servd Logo"
                  width={48}
                  height={48}
                  className="w-14"
                  /> */}
              </div>
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Ratatouille. All rights
                reserved.
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
