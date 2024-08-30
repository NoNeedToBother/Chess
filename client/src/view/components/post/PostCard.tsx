import { Post} from "../../../models/Post";
import { CircleImage } from "../base/CircleImage";
import { ArrowRightCircleIcon, TrashIcon } from '@heroicons/react/16/solid'

export interface PostProps {
    post: Post
    onUserClick?: (id: number) => void
    onReadMoreClick?: (id: number) => void
    showDelete?: boolean
    onDelete?: (id: number) => void
}

export function PostCard({ post, onUserClick, onReadMoreClick, onDelete, showDelete }: PostProps) {
    const profilePictureClickHandler = () => {
        if (onUserClick) onUserClick(post.author.id)
    }
    const readMoreClickHandler = () => {
        if (onReadMoreClick) onReadMoreClick(post.id)
    }

    const deleteHandler = () => {
        if (onDelete) onDelete(post.id)
    }

    return <article
        className="p-6 bg-gray-50 lift [--lift-value:-4px] rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div className="flex mb-5 text-gray-500 justify-between items-center">
            { showDelete !== undefined &&
                <TrashIcon className="h-8 text-gray-200 hover:text-red-400" onClick={ deleteHandler }/>
            }
            <div className="text-sm"> { post.datePosted }</div>
        </div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            { post.title }
        </h2>
        <div className="h-0.5 bg-gray-200"/>
        <p className="mb-5 font-light text-gray-500 dark:text-gray-400"> { post.description }</p>
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <CircleImage src={ post.author.profilePicture } className="h-8" onClick={ profilePictureClickHandler }/>
                <div className="font-medium dark:text-white hover:text-blue-500 hover:underline hover:cursor-pointer"
                     onClick={ profilePictureClickHandler }
                >
                    { post.author.username }
                </div>
            </div>
            <div className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline hover:cursor-pointer">
                <div onClick={ readMoreClickHandler }>Read more</div>
                <ArrowRightCircleIcon className="hover:text-blue-500 hover-slide [--slide-x:6px]" onClick={ readMoreClickHandler }/>
            </div>
        </div>
    </article>
}