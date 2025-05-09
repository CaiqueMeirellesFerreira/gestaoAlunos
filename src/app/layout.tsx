import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// Removed: import { GeistMono } from 'geist/font/mono'; 
import './globals.css';
import { AppShell } from '@/components/app-shell';
import { Toaster } from "@/components/ui/toaster";

const geistSans = GeistSans;
// Removed: const geistMono = GeistMono;

export const metadata: Metadata = {
  title: 'SOS Attendance Tracker',
  description: 'Sistema de Gestão de Alunos e Frequência',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} antialiased`}>
        <AppShell>
          {children}
        </AppShell>
        <Toaster />
      </body>
    </html>
  );
}
