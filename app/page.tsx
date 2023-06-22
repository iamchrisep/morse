import React from 'react'
import Morse from '@/app/Morse'
import * as constants from '@/app/constants'

export default function Home () {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 text-neutral-800">
            <Morse />
            <div className="grid grid-cols-6 gap-x-6 gap-y-2 mt-12">
                {Object.entries(constants.morseMap).map(([k, v]) => (
                    <div key={k} className="flex gap-4 items-baseline">
                        <span className="font-black text-xl">{k !== ' ' ? k : 'Space'}</span>
                        <span className="text-4xl whitespace-nowrap">{v}</span>
                    </div>
                ))}
            </div>
        </main>
    )
}
