import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {CircleImage} from "../../components/base/CircleImage";
import {RatingBar} from "../../components/post/RatingBar";
import {usePost} from "../../../hooks/UsePost";
import {CommentCard} from "../../components/post/comment/CommentCard";
import {CommentForm} from "../../components/post/comment/CommentForm";
import {useComment} from "../../../hooks/UseComment";

export function PostPage() {
    const { id } = useParams()
    const { post, comments, updateRating, addComment } = usePost(id)
    const { comment, uploadComment } = useComment()

    const onRatingChosen = (rating: number) => {
        updateRating(rating)
    }
    const onCommentSubmit = (content: string) => {
        if (post !== null) {
            uploadComment({postId: post.id, content: content})
        }
    }

    useEffect(() => {
        if (comment !== null) {
            addComment(comment)
        }
    }, [comment]);

    return (
        <>
            {post !== null &&
                <div className="w-full h-full bg-white dark:bg-gray-800">
                    <div className="w-full mx-auto py-32 bg-white dark:bg-gray-800">
                        <h1 className="w-[92%] mx-auto lg:text-4xl md:text-3xl xs:text-2xl text-center font-serif font-semibold pb-4 pt-8 dark:text-white">
                            { post.title }</h1>

                        <img src={ post.imageUrl }
                             alt="Post image"
                             className="xl:w-[80%] xs:w-[96%] mx-auto rounded-lg"/>

                        <div className="w-[90%] mx-auto flex md:gap-4 xs:gap-2 justify-center items-center pt-4">
                            <div className="flex gap-2 items-center">
                                <CircleImage src={ post.author.profilePicture } className="h-16"/>
                                <h2 className="text-sm font-semibold dark:text-white">{ post.author.username }</h2>
                            </div>
                            <div className="dark:text-gray-500">|</div>

                            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">{ post.datePosted }</h3>
                        </div>
                        <div className="w-full justify-center items-center mx-auto">
                            <RatingBar rating={ post.rating } onRatingChosen={ onRatingChosen }/>
                        </div>

                        <div className="py-6 bg-white dark:bg-gray-800">
                            <div className="md:w-[80%] xs:w-[90%] mx-auto pt-4">
                                <p className="mt-2 text-2xl dark:text-gray-300">
                                    { post.content }
                                </p>
                            </div>
                        </div>
                        <div className="w-[40%] my-4 mx-auto block md:gap-16 xs:gap-8">
                            { comments !== null &&
                                <CommentForm onSubmit={ onCommentSubmit }/>
                            }
                        </div>
                        <div className="w-[60%] my-4 mx-auto block md:gap-16 xs:gap-8">
                            { comments !== null && comments.map((comment, index) => (
                                <CommentCard comment={ comment } key={ comment.id } />
                            ))
                            }
                        </div>
                    </div>
                </div>
            }
        </>
    )
}