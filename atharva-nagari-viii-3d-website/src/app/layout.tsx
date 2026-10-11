import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Atharva Nagari VIII | Luxury 3D Interactive Walkthrough (Nagpur)',
  description:
    'Experience Atharva Nagari VIII by Atharva Infrastructures along Besa–Pipla Road, Nagpur. Interactive 3D walkthrough, 12-storey towers, sample 2 & 3 BHK flats, dynamic elevators, and luxury amenities. RERA No: P50500053130.',
  keywords: [
    'Atharva Nagari VIII',
    'Atharva Infrastructures Nagpur',
    'Besa Pipla Road Nagpur',
    '3D Walkthrough Real Estate',
    '2 BHK Flats Nagpur',
    '3 BHK Luxury Apartments Nagpur',
  ],
  openGraph: {
    title: 'Atharva Nagari VIII - 3D Luxury Township Walkthrough',
    description: 'Explore the 12-storey township, podium garden, and sample flats in real-time 3D.',
    images: ['/images/atharva/poster.webp'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-white min-h-screen selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
