import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "LocalHands",
  description: "LocalHands lets you trade skills, services, and time using tokens or cash. Connect with your community and exchange what you have to offer.",
  icons: {
    icon: "/logo-v2.png",
    apple: "/logo-v2.png",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
