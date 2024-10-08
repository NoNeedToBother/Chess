import React from "react";

interface CircleImageProps {
    src: string;
    className?: string;
    onClick?: () => void;
}


export function CircleImage({ src, className, onClick }: CircleImageProps) {
    const resultClassName =
        `block mx-auto rounded-full sm:mx-0 sm:shrink-0
        ${ className !== undefined && className }
        ${ onClick !== undefined && " cursor-pointer"}`

    const clickHandler = () => {
        if (onClick !== undefined) { onClick() }
    }
    return <img className= { `${ className } ${ resultClassName }` }
             src={ src } onClick={ clickHandler } alt="Profile picture"/>
}