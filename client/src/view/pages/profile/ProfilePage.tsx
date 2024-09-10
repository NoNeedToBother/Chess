import { useUser } from "../../../hooks/UseUser";
import { useEffect } from "react";
import { useUserContext } from "../../../context/UserContext";
import { PostSection } from "../../components/profile/PostSection";
import { InfoSection } from "../../components/profile/InfoSection";
import { ProfileMainSection } from "../../components/profile/ProfileMainSection";

export function ProfilePage() {
    const userContext = useUserContext()
    const { user, get, userPosts, getPosts } = useUser()

    useEffect(() => {
        if (userContext.user !== null) {
            get(userContext.user.id)
            getPosts(userContext.user.id)
        }
    }, []);

    return <div>
        <section className="w-full overflow-hidden dark:bg-gray-900">
            <div className="flex flex-col">
                <div className="w-full xl:h-[20rem] lg:h-[18rem] md:h-[16rem] sm:h-[14rem] xs:h-[11rem] h-[10rem] bg-gray-200"/>
                <div className="sm:w-[80%] xs:w-[90%] mx-auto flex">
                    { user !== null &&
                        <ProfileMainSection user={ user } own={ true }/>
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
    </div>
}