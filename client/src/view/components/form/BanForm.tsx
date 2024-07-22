import React, {useState} from "react";
import {FormTextAreaElement} from "./FormTextAreaElement";

interface LoginFormProps {
    onSubmit: (reason: string) => void
}

export function BanForm({ onSubmit }: LoginFormProps) {

    const [reason, setReason] = useState('')

    const submitListener = (event: React.FormEvent) => {
        event.preventDefault()
        onSubmit(reason)
    }

    const onReasonChange = (reason: string) => setReason(reason)

    return (
        <form className="space-y-6" onSubmit={ submitListener }>
            <FormTextAreaElement onChange={ onReasonChange } placeholder="Enter reason" name="reason"/>
            <div>
                <button type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >Ban</button>
            </div>
        </form>
    )
}