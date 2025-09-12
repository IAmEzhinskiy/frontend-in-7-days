export const metadata = {
  title: "Frontend in 7 Days",
  description: "Sleek landing for the Frontend in 7 Days guide",
};

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
