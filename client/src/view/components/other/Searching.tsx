import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

export function Searching() {
    const [ dots, setDots ] = useState("")

    const updateDots = () => {
        setDots((prev: string) => {
            if (prev.length === 3) return ""
            else return prev + "."
        })
    }

    useEffect(() => {
        const interval = setInterval(() => updateDots(), 500)

        return () => clearInterval(interval)
    }, []);

    return <div className="flex flex-row justify-center my-4">
        <MagnifyingGlassIcon className="h-8 w-8"/>
        <h1 className="text-center mt-2">{ `Searching${ dots }` }</h1>
    </div>
}