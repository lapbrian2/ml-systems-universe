import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ML Systems Universe — Interactive Learning Course',
  description:
    'An interactive WebGL learning experience for Harvard CS249r Machine Learning Systems. Explore 21 chapters through immersive 3D visualizations, hands-on exercises, and guided progression.',
};

export const viewport: Viewport = {
  themeColor: '#05070f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-[#05070f] text-foreground overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
