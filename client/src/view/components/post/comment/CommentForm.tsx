import React from "react";

export interface CommentFormProps {
    onSubmit: (content: string) => void
}

export function CommentForm({ onSubmit }: CommentFormProps) {
    const [content, setContent] = React.useState<string>('');
    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault()
        if (content.length > 0) {
            onSubmit(content)
        }
    }
    const changeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value)
    }

    return <form className="mb-6" onSubmit={ submitHandler }>
        <div
            className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <label htmlFor="comment" className="sr-only">Your comment</label>
            <textarea id="comment" rows={6}
                      className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                      placeholder="Write a comment..."
                      onChange={changeHandler}
            ></textarea>
        </div>
        <button type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Post comment
        </button>
    </form>
}