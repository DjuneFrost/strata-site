import Navbar from "../components/Navbar";
import PrivyAppProvider from "../components/PrivyProvider";

export const metadata = {
  title: "Zilla Engine",
  description: "Automated DCA accumulation engine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#080808" }}>
        <PrivyAppProvider>
          <Navbar />
          <main style={{ paddingTop: 64 }}>
            {children}
          </main>
        </PrivyAppProvider>
      </body>
    </html>
  );
}