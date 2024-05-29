import {useUser} from "../../../hooks/UseUser";
import React, {useEffect} from "react";
import {useUserContext} from "../../../context/UserContext";
import {ProfileInfo} from "../../components/other/ProfileInfo";
import {useParams} from "react-router-dom";
import {useDataContext} from "../../../context/DataContext";
import {PostCard} from "../../components/post/PostCard";
import {RoleLabel} from "../../components/profile/RoleLabel";
import {HandThumbUpIcon} from "@heroicons/react/16/solid";

export function OtherUserProfilePage() {
    const { id } = useParams()
    const userContext = useUserContext()
    const { navigator } = useDataContext()

    const {user, liked, banned, get, userPosts, getPosts, updateLike} = useUser()
    useEffect(() => {
        if (userContext.user !== null && id !== undefined) {
            if (userContext.user.id === parseInt(id)) navigator.navigateToProfile()
            else {
                get(parseInt(id))
                getPosts(parseInt(id))
            }
        } else if (id !== undefined) {
            get(parseInt(id))
            getPosts(parseInt(id))
        }
    }, []);

    const getLikeColor = () => {
        if (user !== null && liked !== null) {
            if (liked) return " text-green-800"
            else return " text-black"
        } else return " text-black"
    }
    const likeHandler = (event: React.MouseEvent) => {
        if (id !== undefined) {
            updateLike(parseInt(id))
        }
    }

    return <div>
        <section className="w-full overflow-hidden dark:bg-gray-900">
            <div className="flex flex-col">
                <div
                    className="w-full xl:h-[20rem] lg:h-[18rem] md:h-[16rem] sm:h-[14rem] xs:h-[11rem] bg-gray-200"/>

                <div className="sm:w-[80%] xs:w-[90%] mx-auto flex">
                    {user !== null &&
                        <>
                            <div className="block w-full items-center">
                                <img
                                    src={user.profilePicture}
                                    alt="User Profile"
                                    className="rounded-md mx-auto lg:w-[12rem] lg:h-[12rem] md:w-[10rem] md:h-[10rem] sm:w-[8rem] sm:h-[8rem] xs:w-[7rem] xs:h-[7rem] outline outline-2 outline-offset-2 outline-blue-500 lg:bottom-[5rem] sm:bottom-[4rem] xs:bottom-[3rem]"
                                />
                                <div className="lg:w-[6rem] md:w-[5rem] sm:w-[4rem] mx-auto">
                                    <p className="lg:w-[4rem] md:w-[3rem] sm:w-[2rem]">{user.likes + " likes"}</p>
                                    <HandThumbUpIcon className={"h-10 hover:text-green-800" + getLikeColor()} onClick={ likeHandler }/>
                                </div>
                            </div>
                            <h1
                                className="w-full text-left my-4 sm:mx-4 xs:pl-4 text-gray-800 dark:text-white lg:text-4xl md:text-3xl sm:text-3xl xs:text-xl font-serif">
                                {user.username}</h1>
                            <RoleLabel roles={user.roles}/>
                        </>
                    }

                </div>

                <div
                    className="xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] xs:w-[90%] mx-auto flex flex-col gap-4 items-center lg:-top-8 md:-top-6 sm:-top-4 xs:-top-4">
                    {user !== null &&
                        <p className="w-fit text-gray-700 dark:text-gray-400 text-md">{user.bio}
                        </p>
                    }


                    <div className="w-full my-auto py-6 flex flex-col justify-center gap-2">
                        <div className="w-full flex sm:flex-row xs:flex-col gap-2 justify-center">
                            <div className="w-full">
                                <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                                    {user !== null &&
                                        <>
                                            <ProfileInfo label="Name" info={user.name}/>
                                        </>
                                    }
                                </dl>
                            </div>
                            <div className="w-full">
                                <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                                    {user !== null &&
                                        <>
                                            <ProfileInfo label="Last name" info={user.lastname}/>
                                        </>
                                    }
                                </dl>
                            </div>
                        </div>

                    </div>
                </div>
                <h1 className="w-full text-center my-4 sm:mx-4 xs:pl-4 text-gray-800 dark:text-white lg:text-4xl md:text-3xl sm:text-3xl xs:text-xl font-serif">
                    Last posts
                </h1>
                <div className="mx-auto w-1/2 gap-4 columns-1">
                    {userPosts !== null &&
                        userPosts.map((post, _) =>
                            <PostCard post={post} onProfilePictureClick={(id: number) => {}}/>
                        )
                    }
                </div>
            </div>
        </section>

    </div>
}