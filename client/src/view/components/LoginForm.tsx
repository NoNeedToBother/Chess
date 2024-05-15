import React, {useState} from "react";

interface LoginFormProps {
    onSubmit: (username: string, password: string) => void
}

export function LoginForm({ onSubmit }: LoginFormProps) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault()
        onSubmit(username, password)
    }

    const usernameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)
    const passwordChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)

    return (
        <form className="space-y-6" onSubmit={ submitHandler }>
            <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                <div className="mt-2">
                    <input id="username" name="username" type="text"
                           className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                           onChange={ usernameChangeHandler }
                    />
                </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                <div className="mt-2">
                    <input id="password" name="password" type="password"
                           className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                           onChange={ passwordChangeHandler }
                    />
                </div>
            </div>

            <div>
                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
            </div>
        </form>
    )
}