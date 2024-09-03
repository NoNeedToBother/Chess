import React, { useState, useEffect } from 'react';

export interface SlidingInfoProps {
    children: React.ReactNode
    show: boolean
    onClose?: () => void
}

export function SlidingInfo({ children, show, onClose }: SlidingInfoProps) {
    const [ isVisible, setIsVisible ] = useState(show)
    const [ doAnimation, setDoAnimation ] = useState(false)

    useEffect(() => {
        setIsVisible(show)
        if (show) {
            setDoAnimation(true)
            const timer = setTimeout(() => {
                setIsVisible(false)
                setDoAnimation(false)
                onClose?.()
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [ show ])

    if (!isVisible) return null

    return <div className="fixed flex inset-0 items-end md:items-center justify-end pointer-events-none">
        <div className={`bg-white shadow-md rounded-lg border-2 p-4 w-full md:w-1/5
                   pointer-events-auto md:mr-4 md:mt-0 mt-auto
                   ${ doAnimation ? "md:slide-left slide-up" : "mdd:translate-x-full -translate-y-full" }`}>
            { children }
        </div>
    </div>
}