import { Comment } from "../../../../models/Comment";

export interface CommentCardProps {
    comment: Comment
    onUserClick?: (id: number) => void
}

export function CommentCard({ comment, onUserClick }: CommentCardProps) {
    const userClickHandler = () => onUserClick?.(comment.author.id);

    return <article className="p-6 text-base bg-white rounded-lg dark:bg-gray-900 shadow-md lift [--lift-value:-2px]">
        <footer className="flex justify-between items-center mb-2">
            <div className="flex items-center">
                <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold hover:cursor-pointer"
                   onClick={ userClickHandler }
                >
                    <img className="mr-2 w-6 h-6 rounded-full"
                    src={ comment.author.profilePicture }
                    />{ comment.author.username }</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    { comment.datePublished }
                </p>
            </div>
        </footer>
        <p className="text-gray-500 dark:text-gray-400">{ comment.content }</p>
    </article>
}