import "./globals.css";

export const metadata = {
  title: "Rider → Advance Form",
  description: "Upload a rider PDF and get structured fields back"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
