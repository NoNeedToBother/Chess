import React from "react";

interface FormElementProps {
    changeListener: (event: React.ChangeEvent<HTMLInputElement>) => void;
    identifier: string;
    name: string;
    type: string;
}

export function FormElement({ changeListener, identifier, name, type }: FormElementProps) {
    return (
        <div>
            <label htmlFor={ identifier } className="block text-sm font-medium leading-6 text-gray-900"> { name }</label>
            <div className="mt-2">
                <input id= { identifier } name={ identifier } type={ type }
                       className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                       onChange={ changeListener }
                />
            </div>
        </div>
    )
}