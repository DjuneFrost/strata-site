"use client";
import { PrivyProvider } from "@privy-io/react-auth";

export default function PrivyAppProvider({ children }) {
  return (
    <PrivyProvider
      appId="cmsc7gasg003a0djp14syrr8a"
      config={{
        loginMethods: ["email", "wallet", "google", "twitter"],
        appearance: {
          theme: "dark",
          accentColor: "#C0C0C0",
          logo: "/logozillaengine.png",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}