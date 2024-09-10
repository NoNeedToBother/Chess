import React, {useEffect, useState} from "react";
import { User } from "../../../models/User";
import {ArrowUpTrayIcon, HandThumbUpIcon} from "@heroicons/react/16/solid";
import { RoleLabel } from "./RoleLabel";
import { checkAuthorityToBanAndUnban } from "../../../utils/CheckAuthorities";

export interface ProfileMainSectionProps {
    user: User,
    otherUserProfileProps?: OtherUserProfileProps,
    own: boolean,
    ownUserProfileProps?: OwnUserProfileProps
}

export interface OwnUserProfileProps {
    onImageChange: (image: File) => void
}

export interface OtherUserProfileProps {
    from: User,
    isBanned: boolean,
    isLiked: boolean,
    onBan: () => void,
    onUnban: () => void,
    onLikeClick: () => void,
}

export function ProfileMainSection({ own, user, otherUserProfileProps, ownUserProfileProps }: ProfileMainSectionProps) {

    const [ image, setImage ] = useState<File | null>(null)

    useEffect(() => {
        if (image !== null) ownUserProfileProps?.onImageChange(image)
    }, [image])

    const imageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setImage(files[0]);
        }
    }

    const getLikeColor = () => {
        if (!own) {
            if (otherUserProfileProps !== undefined && otherUserProfileProps.isLiked) return "text-green-800"
            else return "text-black"
        } else return "text-black"
    }

    return <>
        <div className="block w-full items-center">
            <img
                src={ user.profilePicture }
                alt="User Profile"
                className="rounded-md mx-auto lg:w-[12rem] lg:h-[12rem] md:w-[10rem] md:h-[10rem] sm:w-[8rem] sm:h-[8rem] xs:w-[7rem] xs:h-[7rem] outline outline-2 outline-offset-2 outline-blue-500 lg:bottom-[5rem] sm:bottom-[4rem] xs:bottom-[3rem]"
            />

            { own && ownUserProfileProps !== undefined &&
                (
                    <div className="relative inline-block w-[75%] my-2 mx-[12.5%]">
                    <input type="file" accept="image/*"
                           onChange={ imageChangeHandler }
                           className="absolute w-full h-full cursor-pointer opacity-0"
                    />
                    <div
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >Update profile picture
                        <ArrowUpTrayIcon className="md:h-6 h-10 my-auto"/>
                    </div>
                </div>
                )
            }
            <div className="lg:w-[6rem] md:w-[5rem] sm:w-[4rem] mx-auto">
                <p className="lg:w-[4rem] md:w-[3rem] sm:w-[2rem]">{user.likes + " likes"}</p>
                <HandThumbUpIcon
                    className={`h-10 ${own ? "" : (otherUserProfileProps?.isLiked ? "" : "hover:text-green-800")} ${getLikeColor()}`}
                    onClick={otherUserProfileProps?.onLikeClick}/>
            </div>

            {!own && otherUserProfileProps !== undefined && checkAuthorityToBanAndUnban(user, otherUserProfileProps.from) &&
                (
                    otherUserProfileProps.isBanned
                        ? <button className="mx-[25%] w-1/2 border-2 border-red-600 hover:bg-red-100"
                                  onClick={() => otherUserProfileProps.onBan()}>Ban</button>

                        : <button className="mx-[25%] w-1/2 border-2 border-green-600 hover:bg-green-100"
                                  onClick={ () => otherUserProfileProps.onUnban() }>Unban</button>

                )
            }
        </div>

        <h1
            className="w-full text-left my-4 sm:mx-4 xs:pl-4 text-gray-800 dark:text-white lg:text-4xl md:text-3xl sm:text-3xl xs:text-xl font-serif">
            { user.username }</h1>
        <RoleLabel roles={ user.roles }/>
    </>
}