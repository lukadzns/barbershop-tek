import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Barbershop Tek – Tilburg',
  description: 'Professionele barbershop in het hart van Tilburg. Knippen, baard trimmen, klassiek scheren. Boek online of bel 06 81958516.',
  keywords: 'barbershop tilburg, kapper tilburg, baard trimmen, fade tilburg, wilhelmstraat tilburg',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Serif+4:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
