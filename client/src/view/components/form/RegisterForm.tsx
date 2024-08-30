import React, {useState} from "react";
import { FormElement } from "./FormElement";

interface LoginFormProps {
    onSubmit: (username: string, password: string, confirmPassword: string) => void,
}

export function RegisterForm({ onSubmit }: LoginFormProps) {
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')

    const submitListener = (event: React.FormEvent) => {
        event.preventDefault()
        onSubmit(username, password, confirmPassword)
    }

    const onUsernameChange = (username: string) => setUsername(username)
    const onPasswordChange = (password: string) => setPassword(password)
    const onConfirmChange = (confirmPassword: string) => setConfirmPassword(confirmPassword)

    return (
        <form className="space-y-6" onSubmit={ submitListener }>
            <FormElement onChange={ onUsernameChange }
                         identifier="username" name="Username" type="text"/>
            <FormElement onChange={ onPasswordChange }
                         identifier="password" name="Password" type="password"/>
            <FormElement onChange={ onConfirmChange }
                         identifier="confirmPassword" name="Confirm password" type="password"/>

            <div>
                <button type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >Register
                </button>
            </div>
        </form>
    )
}