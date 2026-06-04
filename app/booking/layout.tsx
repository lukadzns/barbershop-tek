import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Afspraak boeken – Barbershop Tek Tilburg',
  description: 'Maak eenvoudig online een afspraak bij Barbershop Tek in Tilburg.',
}

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children
}
