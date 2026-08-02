import Sidebar from "../components/Sidebar";
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
          <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
          </div>
        </PrivyAppProvider>
      </body>
    </html>
  );
}