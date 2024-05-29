import React from "react";

export interface FormTextAreaElementProps {
    onChange: (text: string) => void;
    placeholder: string;
    name: string;
    rows?: number
}

export function FormTextAreaElement({ onChange, placeholder, rows, name }: FormTextAreaElementProps) {
    const changeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event.target.value);
    }
    const getRows = () => {
        if (rows !== undefined) return rows
        else return 1
    }
    return <div
        className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 focus:border-blue-300">
        <label htmlFor={name} className="sr-only">{ name }</label>
        <textarea id={ name } rows={ getRows() }
                  className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800 focus:border-blue-300"
                  placeholder={ placeholder }
                  onChange={ changeHandler }
        ></textarea>
    </div>
}