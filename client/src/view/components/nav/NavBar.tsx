import React from "react";
import {User} from "../../../models/User";
import {CircleImage} from "../CircleImage";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import {Navigator} from "../../../utils/Navigator";

interface NavBarProps {
    children: React.ReactNode;
    onLogout: () => void;
    navigator: Navigator;
    user: User;
}

export function NavBar({ children, user, navigator, onLogout }: NavBarProps) {
    const profileClickedHandler = (event: React.MouseEvent) => {
        navigator.navigateToProfile()
    }
    const logoutClickedHandler = (event: React.MouseEvent) => {
        onLogout()
        navigator.navigateToLogin()
    }
    const onProfilePictureClicked = () => navigator.navigateToProfile()
    return (
        <header
            className="fixed inset-x-2 top-0 z-30 mx-auto w-full max-w-screen-md border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
            <div className="px-6">
                <div className="flex items-center justify-between">
                    <div className="hidden md:flex md:items-center md:justify-center md:gap-2">
                        { children }
                    </div>
                    { user !== null &&
                        <div className="flex flex-wrap gap-2 items-center">
                            <CircleImage src={ user.profilePicture } className="h-16" onClick={ onProfilePictureClicked }/>
                            <Menu>
                                <MenuButton className="inline-flex items-center gap-2 rounded-md bg-white py-1.5 px-3 text-sm/6 font-semibold text-white shadow-white/10 focus:outline-none data-[hover]:bg-white data-[open]:bg-white data-[focus]:outline-1 data-[focus]:outline-white">
                                    <ChevronDownIcon className="size-4 fill-black/60" />
                                </MenuButton>
                                <Transition
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95">
                                    <MenuItems
                                        anchor="bottom end"
                                        className="w-52 origin-top-right rounded-xl border border-black/5 bg-white p-1 text-sm/6 text-white [--anchor-gap:var(--spacing-1)] focus:outline-none relative z-50"
                                    >
                                        <MenuItem>
                                            <button onClick={profileClickedHandler}
                                                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 text-black">
                                                Profile
                                            </button>
                                        </MenuItem>
                                        <div className="my-1 h-px bg-black/5"/>
                                        <MenuItem>
                                            <button onClick={logoutClickedHandler}
                                                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 text-red-400">
                                            Logout
                                            </button>
                                        </MenuItem>
                                    </MenuItems>
                                </Transition>
                            </Menu>
                        </div>
                    }
                </div>
            </div>
        </header>
    )
}