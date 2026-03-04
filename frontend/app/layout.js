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
    <ClerkProvider appearance={{ baseTheme: neobrutalism }}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Header />
          <main className="flex min-h-screen flex-col">{children}</main>
          <Toaster richColors />

          <footer className="px-4 py-3 border-t">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
              {/* LEFT - Logo */}
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Cooksyy Logo"
                  width={80}
                  height={80}
                  className="h-19 w-auto"
                />
              </div>

              {/* CENTER */}
              <p className="text-sm text-muted-foreground text-center">
                &copy; {new Date().getFullYear()} Ratatouille. All rights
                reserved.
              </p>

              {/* RIGHT */}
              <p className="text-sm text-muted-foreground">
                Made with <span className="text-red-500">❤️</span> by{" "}
                <span className="font-medium">Tanishq Pal</span>
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
