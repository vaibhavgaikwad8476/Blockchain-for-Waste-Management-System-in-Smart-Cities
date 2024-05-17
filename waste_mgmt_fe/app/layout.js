"use client";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/custom/Sidebar";
import { Toaster } from "@/components/ui/toaster";

export const fontSans = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "400",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const routesWithoutSidebar = ["/login", "/register", "/"];

  if (routesWithoutSidebar.includes(pathname)) {
    return (
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          {children}
          <Toaster />
        </body>
      </html>
    );
  }
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Sidebar>{children}</Sidebar>
        <Toaster />
      </body>
    </html>
  );
}
