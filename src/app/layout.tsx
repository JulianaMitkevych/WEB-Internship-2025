
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React, { ReactNode } from 'react';

import { StorageProvider } from '@/context/storageProvider';
import { AuthInitializer } from '@/components/auth/AuthInitializer';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'], 
  variable: '--font-inter',      
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GrowBox',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <StorageProvider>
          <AuthInitializer />
          {children}
        </StorageProvider>
      </body>
    </html>
  );
}