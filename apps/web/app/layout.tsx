import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'TourMatch',
  description: 'Conectando turistas e guias turísticos'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
