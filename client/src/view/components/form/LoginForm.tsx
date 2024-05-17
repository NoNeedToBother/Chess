import React, {useState} from "react";
import {FormElement} from "./FormElement";

interface LoginFormProps {
    onSubmit: (username: string, password: string) => void
}

export function LoginForm({ onSubmit }: LoginFormProps) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const submitListener = (event: React.FormEvent) => {
        event.preventDefault()
        onSubmit(username, password)
    }

    const usernameChangeListener = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)
    const passwordChangeListener = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)

    return (
        <form className="space-y-6" onSubmit={ submitListener }>
            <FormElement changeListener={ usernameChangeListener } identifier="username" name="Username" type="text"/>
            <FormElement changeListener={ passwordChangeListener } identifier="password" name="Password" type="password"/>
            <div>
                <button type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >Sign in
                </button>
            </div>
        </form>
    )
}