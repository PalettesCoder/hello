import "./globals.css";

export const metadata = {
  title: "Neuros Case Study | Harsha Royal",
  description: "AI-powered product design and development",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
