import React from "react";
import { User } from "../../../models/User";
import { CircleImage } from "../base/CircleImage";
import { Navigator } from "../../../utils/Navigator";
import { UserMenu } from "./UserMenu";
import { ChessLogo } from "../base/ChessLogo";

interface NavBarProps {
    children: React.ReactNode;
    onLogout?: () => void;
    navigator: Navigator;
    user: User;
}

export function NavBar({ children, user, navigator, onLogout }: NavBarProps) {

    const onProfilePictureClicked = () => navigator.navigateToProfile()

    return <header
        className="fixed inset-x-2 top-0 z-30 mx-auto w-full max-w-screen-md border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
        <div className="flex px-6">
            <ChessLogo interactable={ true } showPawn={ true }/>
            <div className="flex w-full items-center md:justify-between justify-end">
                <div className="hidden md:flex md:items-center md:justify-center md:gap-2">
                    { children }
                </div>
                { user !== null &&
                    <div className="flex flex-wrap gap-2 items-center">
                        <CircleImage src={ user.profilePicture } className="h-16" onClick={ onProfilePictureClicked }/>
                        <UserMenu navigator={ navigator } onLogout={ onLogout }/>
                    </div>
                }
            </div>
        </div>
    </header>
}