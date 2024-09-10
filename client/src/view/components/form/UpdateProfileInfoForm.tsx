import React, { useState } from "react";
import { FormTextAreaElement } from "./FormTextAreaElement";
import { FormElement } from "./FormElement";

interface LoginFormProps {
    onSubmit: (name: string | undefined,
               lastname: string | undefined,
               bio: string | undefined) => void
}

export function UpdateProfileInfoForm({ onSubmit }: LoginFormProps) {

    const [ name, setName ] = useState<string | undefined>(undefined)
    const [ lastname, setLastname ] = useState<string | undefined>(undefined)
    const [ bio, setBio ] = useState<string | undefined>(undefined)

    const submitListener = (event: React.FormEvent) => {
        event.preventDefault()
        onSubmit(name, lastname, bio)
    }

    const onNameChange = (name: string) => {
        if (name.trim().length === 0) setName(undefined)
        else setName(name)
    }
    const onLastnameChange = (lastname: string) => {
        if (lastname.trim().length === 0) setLastname(undefined)
        else setLastname(lastname)
    }
    const onBioChange = (bio: string) => {
        if (bio.trim().length === 0) setBio(undefined)
        else setBio(bio)
    }

    return (
        <form className="space-y-6" onSubmit={ submitListener }>
            <FormElement onChange={ onNameChange } identifier="name" name="Name" type="text"/>
            <FormElement onChange={ onLastnameChange } identifier="lastname" name="Lastname" type="text"/>
            <FormTextAreaElement onChange={ onBioChange } placeholder="Enter bio" name="bio"/>
            <button type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Submit changes</button>
        </form>
    )
}