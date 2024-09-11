import React from "react";

interface FormElementProps {
    onChange: (value: string) => void;
    identifier: string;
    name: string;
    type: string;
}

export function FormElement({ onChange, identifier, name, type }: FormElementProps) {
    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    }
    return (
        <div>
            <label htmlFor={ identifier } className="block text-sm font-medium leading-2 text-gray-900 dark:text-gray-100"> { name }</label>
            <div className="mt-2">
                <input id= { identifier } name={ identifier } type={ type }
                       className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                       onChange={ changeHandler }
                />
            </div>
        </div>
    )
}