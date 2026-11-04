import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "DealRoom",
  description: "Selección privada de propiedades de alto patrimonio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        {/* Chat widget de GHL */}
        <Script
          src="https://widgets.leadconnectorhq.com/loader.js"
          data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
          data-widget-id="6aeb6c603c83530a428f38c8"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
