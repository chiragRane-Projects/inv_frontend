import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart Logistics",
  description: `
AI-powered logistics and inventory management system.

It helps a logistics company to:
- Track inventory in warehouses
- Handle orders
- Predict future demand using Machine Learning
- Automatically decide how much stock to reorder
`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${outfit.className}`}
      >
        <Toaster position="top-center" richColors/>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
