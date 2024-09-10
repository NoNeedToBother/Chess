import { useUser } from "../../../hooks/UseUser";
import React, { useEffect, useState } from "react";
import { useUserContext } from "../../../context/UserContext";
import { useParams } from "react-router-dom";
import { useDataContext } from "../../../context/DataContext";
import { NoSymbolIcon, InformationCircleIcon } from "@heroicons/react/16/solid";
import { Modal } from "../../components/base/Modal";
import { useBan } from "../../../hooks/UseBan";
import { BanForm } from "../../components/form/BanForm";
import { PostSection } from "../../components/profile/PostSection";
import { InfoSection } from "../../components/profile/InfoSection";
import { ProfileMainSection } from "../../components/profile/ProfileMainSection";

export function OtherUserProfilePage() {
    const { id } = useParams()
    const { user } = useUserContext()
    const { navigator } = useDataContext()

    const { user: other, liked, ban, get, userPosts, getPosts, updateLike } = useUser()
    const { banResult, unbanResult, ban: banByUser, unban: unbanByUser } = useBan()

    const [ showBanInfoModal, setShowBanInfoModal ] = useState(false)
    const [ showBanModal, setShowBanModal ] = useState(false)

    useEffect(() => {
        if (banResult !== undefined) {
            if (banResult.error !== undefined) {}
            else if (id !== undefined) {
                get(parseInt(id))
                getPosts(parseInt(id))
            }
        }
    }, [banResult]);

    useEffect(() => {
        if (unbanResult !== undefined) {
            if (unbanResult.error !== undefined) {}
            else if (id !== undefined) {
                get(parseInt(id))
                getPosts(parseInt(id))
            }
        }
    }, [unbanResult]);

    useEffect(() => {
        if (user !== null && id !== undefined) {
            if (user.id === parseInt(id)) navigator.navigateToProfile()
            else {
                get(parseInt(id))
                getPosts(parseInt(id))
            }
        } else if (id !== undefined) {
            get(parseInt(id))
            getPosts(parseInt(id))
        }
    }, [])

    const onLikeClick = () => {
        if (id !== undefined) {
            updateLike(parseInt(id))
        }
    }

    const infoHandler = () => setShowBanInfoModal(true)

    const onBan = () => setShowBanModal(true)
    const onUnban = () => {
        if (id !== undefined) {
            unbanByUser(parseInt(id))
        }
    }

    const onBanFormSubmit = (reason: string) => {
        if (id !== undefined) {
            setShowBanModal(false)
            banByUser(reason, parseInt(id))
        }
    }

    return <div>
        <section className="w-full overflow-hidden dark:bg-gray-900">
            { showBanInfoModal && ban !== null &&
                <Modal title="Ban info" onClose={ () => setShowBanInfoModal(false) }>
                    <h1 className="text-gray-700"> { `Given by ${ ban.givenFromUsername }` }</h1>
                    <h1 className="text-gray-700"> { `Given at ${ ban.givenAt }` }</h1>
                    <h1 className="text-xl">{ `Reason: ${ ban.reason }` }</h1>
                </Modal>
            }
            { showBanModal &&
                <Modal title="Ban user" onClose={ () => setShowBanModal(false) }>
                    <BanForm onSubmit={ onBanFormSubmit }/>
                </Modal>
            }
            <div className="flex flex-col">
                <div className="w-full xl:h-[20rem] lg:h-[18rem] md:h-[16rem] sm:h-[14rem] xs:h-[11rem] h-[10rem] bg-gray-200"/>
                <div className="sm:w-[80%] xs:w-[90%] mx-auto flex">
                    { other !== null && user !== null &&
                        <ProfileMainSection user={ other } own={ false }
                                            otherUserProfileProps={
                            { from: user, isBanned: ban !== null, isLiked: liked !== null && liked, onBan, onUnban, onLikeClick }
                        }
                        />
                    }
                </div>

                <div className="xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] xs:w-[90%] mx-auto flex flex-col gap-4 items-center lg:-top-8 md:-top-6 sm:-top-4 xs:-top-4">
                    { ban !== null &&
                        <div className="flex">
                            <NoSymbolIcon className="md:h-12 sm:h-8 my-auto text-red-500"/>
                            <p className="w-fit text-red-600 pl-4 xl:text-6xl md:text-5xl sm:text-4xl">
                            This user is banned</p>
                            <InformationCircleIcon className="md:h-12 sm:h-8 my-auto" onClick={ infoHandler }/>
                        </div>
                    }
                    { other !== null &&
                        <p className="w-fit text-gray-700 dark:text-gray-400 text-md">{ other.bio }</p>
                    }
                    <InfoSection user={ other }/>
                </div>
                <PostSection posts={ userPosts }/>
            </div>
        </section>
    </div>
}