import React, { useEffect, useState } from "react"
import { FormElement } from "../../components/form/FormElement";
import { useUploadPost } from "../../../hooks/UseUploadPost";
import { FormTextAreaElement } from "../../components/form/FormTextAreaElement";
import { useDataContext } from "../../../context/DataContext";
import { ArrowUpTrayIcon } from "@heroicons/react/16/solid";

export function UploadPostPage() {
    const { upload, uploadedPost } = useUploadPost()
    const { navigator } = useDataContext()

    const [ title, setTitle ] = useState<string | null>(null)
    const [ content, setContent ] = useState<string | null>(null)
    const [ description, setDescription ] = useState<string | null>(null)
    const [ image, setImage ] = useState<File | null>(null)

    const onTitleChange = (title: string) => setTitle(title)
    const onContentChange = (content: string) => setContent(content)
    const onDescriptionChange = (desc: string) => setDescription(desc)

    const imageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setImage(files[0]);
        }
    };

    useEffect(() => {
        if (uploadedPost !== null) navigator.navigateToPost(uploadedPost.id)
    }, [uploadedPost]);

    const formSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (title !== null && content !== null && description !== null && image !== null) {
            upload({
                title: title, content: content, description: description, image: image
            })
        }
    }

    return <div className="w-full h-full">
        <form onSubmit={ formSubmitHandler }>
            <div className="w-full mx-auto py-32">
                <img src={ image === null ? "https://parpol.ru/wp-content/uploads/2019/09/placeholder.png" : URL.createObjectURL(image) }
                     alt="Post image"
                     className="xl:w-[60%] xs:w-[76%] mx-auto lg:h-[480px] md:h-[360px] rounded-lg"/>

                <div className="relative flex mx-auto w-[20%] mt-4">
                    <input type="file" accept="image/*"
                           className="absolute flex w-full justify-center opacity-0 cursor-pointer"
                           onChange={ imageChangeHandler }
                    />
                    <div
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Browse images
                    </div>
                </div>

                <div className="w-1/2 mx-auto items-center">
                    <FormElement onChange={ onTitleChange } identifier="title" name="Post title" type="text"/>
                    <FormTextAreaElement onChange={ onDescriptionChange } placeholder="Enter description..."
                                         name="description" rows={ 2 }/>
                </div>
                <div className="w-[80%] mx-auto items-center">
                    <FormTextAreaElement onChange={ onContentChange } placeholder="Enter content..." name="content"
                                         rows={ 5 }/>
                </div>
                <div className="flex mx-auto md:w-[30%] w-1/2 mt-4">
                    <button type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >Upload
                        <ArrowUpTrayIcon className="h-6"/>
                    </button>
                </div>
            </div>
        </form>
    </div>
}