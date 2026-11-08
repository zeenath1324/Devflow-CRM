import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '../context/AuthContext';

export const metadata: Metadata = {
  title: 'DEVFLOW CRM — The Intelligent Operating System for Software Companies',
  description: 'Enterprise CRM and unified business management platform for software companies and IT agencies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-devflow-bg text-slate-100 antialiased selection:bg-devflow-violet selection:text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
