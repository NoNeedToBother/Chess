import React from "react";
import { PostCard } from "../post/PostCard";
import { Post } from "../../../models/Post";

export interface PostSectionProps {
    posts: Post[] | null
    onProfilePictureClick?: (id: number) => void
    onReadMoreClick?: (id: number) => void
}

export function PostSection({ posts, onProfilePictureClick, onReadMoreClick }: PostSectionProps) {
    return <>
        <h1 className="w-full text-center my-4 sm:mx-4 xs:pl-4 text-gray-800 dark:text-white lg:text-4xl md:text-3xl sm:text-3xl xs:text-xl font-serif">
            Last posts
        </h1>
        <div className="mx-auto md:w-1/2 w-full grid md:gap-2 gap-1 columns-1">
            { posts !== null &&
                posts.map((post, _) =>
                    <PostCard post={ post }
                              onUserClick={ onProfilePictureClick }
                              onReadMoreClick={ onReadMoreClick }
                    />
                )
            }
        </div>
    </>
}