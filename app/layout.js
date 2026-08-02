import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "Zilla Engine",
  description: "Automated DCA accumulation engine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#080808" }}>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}