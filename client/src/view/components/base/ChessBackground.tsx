import React, { useEffect, useRef, useState } from "react";

export function ChessBackground() {
    const [ mobile, setMobile ] = useState(false)
    const imgRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        const onResize = () => setMobile(window.innerWidth <= 720)
        onResize()

        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [])

    useEffect(() => {
        const onScroll = () => {
            if (imgRef.current !== null) {
                imgRef.current.style.marginTop = `${ -window.scrollY * 0.05 }px`
            }
        }

        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return <div className="fixed inset-0 w-full h-full -z-40" ref={ imgRef }>
        <img src={ mobile ? "/bg_mobile.png" : "/bg_desktop.png" }
             className="opacity-30 dark:opacity-60"/>
    </div>
}