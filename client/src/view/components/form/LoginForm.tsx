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

    const onUsernameChange = (username: string) => setUsername(username)
    const onPasswordChange = (password: string) => setPassword(password)

    return (
        <form className="space-y-6" onSubmit={ submitListener }>
            <FormElement onChange={ onUsernameChange } identifier="username" name="Username" type="text"/>
            <FormElement onChange={ onPasswordChange } identifier="password" name="Password" type="password"/>
            <button type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >Sign in
            </button>
        </form>
    )
}