import React from "react";
interface NavBarProps {
    children: React.ReactNode;
}

export function NavBar({ children }: NavBarProps) {
    return (
        <header
            className="fixed inset-x-2 top-0 z-30 mx-auto w-full max-w-screen-md border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
            <div className="px-6">
                <div className="flex items-center justify-between">
                    <div className="hidden md:flex md:items-center md:justify-center md:gap-2">
                        { children }
                    </div>
                </div>
            </div>
        </header>
    )
}