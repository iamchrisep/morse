import React from 'react'
import { Nunito } from 'next/font/google'
import '@/app/globals.css'

const nunito = Nunito({ subsets: ['latin'] })

export const metadata = {
    title: 'Morse',
    description: 'Morse code app'
}

export default function RootLayout ({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={nunito.className}>{children}</body>
        </html>
    )
}
