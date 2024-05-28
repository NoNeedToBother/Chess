import { Post} from "../../../models/Post";
import {Link} from "react-router-dom";
import {CircleImage} from "../base/CircleImage";
import {ArrowRightCircleIcon} from '@heroicons/react/16/solid'

export interface PostProps {
    post: Post;
    onProfilePictureClick: (id: number) => void;
}

export function PostCard({ post, onProfilePictureClick }: PostProps) {
    const onProfilePictureClicked = () => {
        onProfilePictureClick(post.author.id);
    }
    return <article
        className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div className="flex mb-5 text-gray-500 justify-between items-center">
            <div></div>
            <span className="text-sm"> { post.datePosted }</span>
        </div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            { post.title }
        </h2>
        <p className="mb-5 font-light text-gray-500 dark:text-gray-400"> { post.description }</p>
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <CircleImage src={ post.author.profilePicture } className="h-8" onClick={ onProfilePictureClicked }/>
                <span className="font-medium dark:text-white">
                    <Link to={"/profile/" + post.author.id}>{ post.author.username }</Link>
                </span>
            </div>
            <div className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline">
                <Link to={ "/post/" + post.id }>Read more</Link>
                <ArrowRightCircleIcon/>
            </div>
        </div>
    </article>
}