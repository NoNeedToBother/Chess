import React from "react";

interface CircleImageProps {
    src: string;
    className?: string;
    onClick?: () => void;
}


export function CircleImage( {src, className, onClick}: CircleImageProps) {
    let resultClassName = "block mx-auto rounded-full sm:mx-0 sm:shrink-0"
    if (className !== undefined) {
        resultClassName += className
    }
    if (onClick !== undefined) {
        resultClassName += " cursor-pointer"
    }
    const clickHandler = (event: React.MouseEvent<HTMLImageElement>) => {
        if (onClick !== undefined) { onClick() }
    }
    return (
        <img className= { className + " " + resultClassName }
             src={ src } onClick={ clickHandler }  alt="Profile picture"/>
    )
}