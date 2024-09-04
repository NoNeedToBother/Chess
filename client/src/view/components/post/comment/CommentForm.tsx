import React from "react";
import { FormTextAreaElement } from "../../form/FormTextAreaElement";

export interface CommentFormProps {
    onSubmit: (content: string) => void
}

export function CommentForm({ onSubmit }: CommentFormProps) {
    const [ content, setContent ] = React.useState<string>('')

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault()
        if (content.length > 0) {
            onSubmit(content)
        }
    }
    const onCommentChange = (content: string) => setContent(content)

    return <form className="mb-6" onSubmit={ submitHandler }>
        <FormTextAreaElement onChange={ onCommentChange } placeholder="Enter a comment..." name="comment" rows={ 6 }/>
        <button type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Post comment
        </button>
    </form>
}