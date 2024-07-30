import { Comment } from "../../../../models/Comment";

export interface CommentCardProps {
    comment: Comment;
}

export function CommentCard({ comment }: CommentCardProps) {
    return <article className="p-6 text-base bg-white rounded-lg dark:bg-gray-900 shadow-md lift">
        <footer className="flex justify-between items-center mb-2">
            <div className="flex items-center">
                <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold"><img
                    className="mr-2 w-6 h-6 rounded-full"
                    src={ comment.author.profilePicture }
                    alt="Author"/>{ comment.author.username }</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    { comment.datePublished }
                </p>
            </div>
        </footer>
        <p className="text-gray-500 dark:text-gray-400">{ comment.content }</p>
    </article>
}