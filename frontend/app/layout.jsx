import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "../src/index.css";
import { AuthProvider } from "../src/Context/AuthContext";
import { SocketProvider } from "../src/Context/SocketContext";
import { Toaster } from "react-hot-toast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "Date-NearMe | Designed to Be Deleted",
  description: "Intentional dating with single-slot focus, verified liveness, and partner cafe dates.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-[#FAF8F5] text-[#1C1917] font-sans antialiased selection:bg-[#711A31]/15 selection:text-[#711A31]">
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <AuthProvider>
          <SocketProvider>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(231, 229, 228, 0.9)",
                  boxShadow: "0 12px 35px -5px rgba(0, 0, 0, 0.08)",
                  color: "#1C1917",
                  fontWeight: 600,
                  fontSize: "13px",
                  borderRadius: "9999px",
                  padding: "10px 18px",
                },
              }}
            />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
