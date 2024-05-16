import React from 'react';

interface AuthMenuProps {
    title: string;
    error: string | undefined;
    children: React.ReactNode;
}

export function AuthMenu({ title, error, children }: AuthMenuProps) {
    return (
        <>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">{title}</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                { children }
            </div>
            { error !== undefined &&
                <p className="mt-3 text-xl text-center text-red-400 font-light"> { error } </p>
            }
        </>
    )
}