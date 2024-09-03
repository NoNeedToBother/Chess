import { useUser } from "../../../hooks/UseUser";
import React, { useEffect, useState } from "react";
import { useUserContext } from "../../../context/UserContext";
import { RoleLabel } from "../../components/profile/RoleLabel";
import { ArrowUpTrayIcon, HandThumbUpIcon } from "@heroicons/react/16/solid";
import { PostSection } from "./PostSection";
import { InfoSection } from "./InfoSection";

export function ProfilePage() {
    const userContext = useUserContext()
    const { user, get, userPosts, getPosts, updateProfilePicture } = useUser()

    const [ image, setImage ] = useState<File | null>(null)

    useEffect(() => {
        if (userContext.user !== null) {
            get(userContext.user.id)
            getPosts(userContext.user.id)
        }
    }, []);

    useEffect(() => {
        if (image !== null) updateProfilePicture(image)
    }, [image]);

    const imageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setImage(files[0]);
        }
    };

    return <section className="w-full overflow-hidden dark:bg-gray-900">
        <div className="flex flex-col">
            <div className="w-full xl:h-[20rem] lg:h-[18rem] md:h-[16rem] sm:h-[14rem] xs:h-[11rem] h-[10rem] bg-gray-200"/>
            <div className="sm:w-[80%] xs:w-[90%] mx-auto flex">
                { user !== null &&
                    <>
                        <div className="block w-full items-start">
                            <img
                                src={ user.profilePicture }
                                alt="User Profile"
                                className="rounded-md mx-auto lg:w-[12rem] lg:h-[12rem] md:w-[10rem] md:h-[10rem] sm:w-[8rem] sm:h-[8rem] xs:w-[7rem] xs:h-[7rem] outline outline-2 outline-offset-2 outline-blue-500 lg:bottom-[5rem] sm:bottom-[4rem] xs:bottom-[3rem]"
                            />
                            <div className="relative inline-block w-[75%] my-2 mx-[12.5%]">
                                <input type="file" accept="image/*"
                                       onChange={ imageChangeHandler }
                                       className="absolute w-full h-full cursor-pointer opacity-0"
                                />
                                <div className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >Update profile picture
                                        <ArrowUpTrayIcon className="md:h-6 h-10 my-auto"/>
                                </div>
                            </div>

                            <div className="lg:w-[6rem] md:w-[5rem] sm:w-[4rem] mx-auto">
                                <p className="lg:w-[4rem] md:w-[3rem] sm:w-[2rem] text-center mx-auto">{ user.likes + " likes" }</p>
                                <HandThumbUpIcon className="h-10 mx-auto"/>
                            </div>
                        </div>
                        <h1
                            className="w-full text-left my-4 sm:mx-4 xs:pl-4 text-gray-800 dark:text-white lg:text-4xl md:text-3xl sm:text-3xl xs:text-xl font-serif">
                            { user.username }</h1>
                        <RoleLabel roles={ user.roles }/>
                    </>
                }
            </div>

            <div
                className="xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] xs:w-[90%] mx-auto flex flex-col gap-4 items-center lg:-top-8 md:-top-6 sm:-top-4 xs:-top-4">
                { user !== null &&
                    <p className="w-fit text-gray-700 dark:text-gray-400 text-md">{ user.bio }</p>
                }
                <InfoSection user={ user }/>
            </div>
            <PostSection posts={ userPosts }/>
        </div>
    </section>
}