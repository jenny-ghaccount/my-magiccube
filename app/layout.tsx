import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'MagicCube Solver - Solve Your Rubik\'s Cube',
  description: 'A fun, colorful web app to help you solve your 3x3 Rubik\'s Cube. Enter your cube colors and get step-by-step solution!',
  keywords: ['rubiks cube', 'cube solver', 'puzzle', 'rubik solver'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Header />
          <main style={{ minHeight: 'calc(100vh - 64px)' }}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
