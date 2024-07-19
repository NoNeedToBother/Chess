import {useEffect, useState} from "react";
import {Post} from "../models/Post";
import {useDataContext} from "../context/DataContext";
import {useUserContext} from "../context/UserContext";

export interface PostUploadData {
    title: string;
    content: string;
    description: string;
    image: File
}

export function useUploadPost() {
    const { postService } = useDataContext()
    const { jwt } = useUserContext()

    const [ postData, setPostData ] = useState<PostUploadData | null>(null)
    const [uploadedPost, setUploadedPost] = useState<Post | null>(null)

    const upload = (request: PostUploadData) => setPostData(request)

    useEffect(() => {
        if (postData !== null && jwt !== null) {
            postService.upload({
                title: postData.title,
                content: postData.content,
                description: postData.description,
                jwt: jwt,
                image: postData.image
            }
            ).then(res => {
                if (res.post !== undefined) setUploadedPost(res.post)
            })
        }
    }, [postData]);

    return { upload, uploadedPost }
}