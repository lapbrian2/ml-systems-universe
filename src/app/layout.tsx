import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ML Systems Universe — Interactive Learning Course',
  description:
    'An interactive WebGL learning experience for Harvard CS249r Machine Learning Systems. Explore 21 chapters through immersive 3D visualizations, hands-on exercises, and guided progression.',
  themeColor: '#05070f',
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
