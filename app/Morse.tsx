'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as constants from '@/app/constants'
import Loader from '@/app/Loader'

const Morse = () => {
    const [morse, setMorse] = useState<String>('')
    const [text, setText] = useState<String>('')
    const [isPending, setIsPending] = useState<Boolean>(false)
    const [isPressed, setIsPressed] = useState<Boolean>(false)
    const [character, setCharacter] = useState<String>('')

    const lastPressDown = useRef(0)
    const lastPressUp = useRef(0)
    const lastPressUpInactivity = useRef(0)
    const currentMorse = useRef('')
    const word = useRef('')
    const isKeyStop = useRef(false)

    const decodeMorseToCharacter = (morseCode: string): string => {
        if (!morseCode.length) return ''
        return Object.keys(constants.morseMap)
            .find(k => constants.morseMap[k as keyof typeof constants.morseMap] === morseCode) ||
            '❌'
    }

    const decodeFromMorseToText = useCallback((morseCode: string): string => {
        return morseCode
            .split(' ')
            .map(decodeMorseToCharacter)
            .join('')
    }, [])

    const checkLetter = useCallback((now: Number) => {
        if (lastPressUp.current === now) {
            lastPressDown.current = 0
            lastPressUp.current = 0

            const newMorseText = currentMorse.current + ' '
            const decodedText = decodeFromMorseToText(newMorseText)
            word.current = word.current + decodeFromMorseToText(newMorseText)

            currentMorse.current = ''
            setCharacter('')
            setMorse((prevMorse) => prevMorse + newMorseText)
            setText((prevText) => prevText + decodedText)
            setIsPending(false)
        }
    }, [decodeFromMorseToText])

    const checkInactivity = useCallback((now: Number) => {
        if (lastPressUpInactivity.current === now) {
            lastPressUpInactivity.current = 0
            word.current = ''
            setMorse((prevMorse) => prevMorse + ' / ')
            setText((prevText) => prevText + ' ')
        }
    }, [])

    const handleDown = () => {
        setIsPressed(true)
        lastPressDown.current = Date.now()
        lastPressUp.current = 0
        lastPressUpInactivity.current = 0
    }

    const handleUp = useCallback(() => {
        setIsPressed(false)
        setIsPending(true)

        const now = Date.now()

        const timeElapsed = now - lastPressDown.current
        const morseCharacter = timeElapsed < constants.dotDuration ? '·' : '-'

        lastPressDown.current = 0
        lastPressUp.current = now
        lastPressUpInactivity.current = now

        currentMorse.current = currentMorse.current + morseCharacter

        setCharacter(morseCharacter)

        setTimeout(() => checkLetter(now), constants.letterDuration)
        setTimeout(() => checkInactivity(now), constants.inactivityDuration)
    }, [checkLetter, checkInactivity])

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === ' ' || event.code === 'Space' || event.keyCode === 32) {
            if (isKeyStop.current) {
                return event.key
            }
            event.preventDefault()
            isKeyStop.current = true
            handleDown()
        }
    }, [])

    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        if (event.key === ' ' || event.code === 'Space' || event.keyCode === 32) {
            event.preventDefault()
            isKeyStop.current = false
            handleUp()
        }
    }, [])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
        }
    }, [handleKeyDown, handleKeyUp])

    return (
        <div className="flex flex-col flex-1 items-start w-full gap-4">
            <div className="flex items-baseline gap-2 text-lg">
                <span className="font-bold">Morse code:</span>
                <span>{morse}</span>
            </div>
            <div className="flex items-baseline gap-2 text-lg">
                <span className="font-bold">Decoded text:</span>
                <span>{text}</span>
            </div>
            <div className="flex items-baseline gap-2 text-lg">
                <span className="font-bold">Decoded word:</span>
                <span>{word.current}</span>
                {isPending && (
                    <Loader />
                )}
            </div>
            <div className="flex items-baseline gap-2 text-lg">
                <span className="font-bold">Current hypothetical Morse signal:</span>
                {isPressed
                    ? (
                        <Loader />
                        )
                    : (
                        <span>{character}</span>
                        )
                }
            </div>
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="bg-yellow-400 hover:bg-amber-400 rounded-lg font-bold px-6 py-3 !outline-none !ring-0"
                    onMouseDown={() => handleDown()}
                    onMouseUp={() => handleUp()}
                >
                    Signal
                </button>
                <span className="font-medium">or press spacebar</span>
            </div>
        </div>
    )
}

export default Morse
