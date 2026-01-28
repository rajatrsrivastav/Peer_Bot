import Navbar from "@/components/Navbar/Navbar";
import AuthProvider from "@/context/auth";
import ChatbotProvider from "@/context/chatbot";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script'
import './globals.css'

export const metadata = {
  title: "PeerBot",
  description: "Your smart peer assistant powered by Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W41ELYWF9X"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W41ELYWF9X');
          `}
        </Script>
      </head>
      <body>
        <Providers>
          <AuthProvider>
            <ChatbotProvider>
              <Navbar />
              {children}
            </ChatbotProvider>
          </AuthProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}