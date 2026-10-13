import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PricePulse Myanmar | AI-Powered Wholesale–Retail Pricing Intelligence',
  description: 'Connected pricing intelligence, Gemini supplier message extraction, and exact margin impact for Myanmar retailers & wholesalers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}