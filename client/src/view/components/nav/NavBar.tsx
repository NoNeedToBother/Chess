import React from "react";
import {User} from "../../../models/User";
import {CircleImage} from "../base/CircleImage";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import {Navigator} from "../../../utils/Navigator";
import {Link} from "react-router-dom";

interface NavBarProps {
    children: React.ReactNode;
    onLogout: () => void;
    navigator: Navigator;
    user: User;
}

export function NavBar({ children, user, navigator, onLogout }: NavBarProps) {
    const profileClickedHandler = (_: React.MouseEvent) => {
        navigator.navigateToProfile()
    }
    const logoutClickedHandler = (_: React.MouseEvent) => {
        onLogout()
    }
    const onProfilePictureClicked = () => navigator.navigateToProfile()
    return (
        <header
            className="fixed inset-x-2 top-0 z-30 mx-auto w-full max-w-screen-md border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
            <span className="flex px-6">
                <div className="flex w-[40%] items-center font-logo text-5xl hover:text-6xl hover:text-blue-800">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="fill-current"
                         viewBox="0 0 297 297">
                        <path
                            d="M223.333 247h-5.926c2.607-3.811 10.798-18.024-.727-32.248-13.334-16.46-39.863-65.748-27.324-98.752h.977c4.418 0 7.667-3.582 7.667-8v-1c0-4.418-3.249-8-7.667-8h-1.225c10.917-10.466 17.725-25.184 17.725-41.5 0-31.756-25.744-57.5-57.5-57.5s-57.5 25.744-57.5 57.5c0 16.316 6.808 31.034 17.725 41.5h-2.225c-4.418 0-8.333 3.582-8.333 8v1c0 4.418 3.915 8 8.333 8h1.979c12.539 33.004-13.99 82.292-27.324 98.752-11.524 14.224-3.334 28.437-.727 32.248h-6.928c-4.418 0-8.333 3.582-8.333 8v18c0 4.418 3.915 8 8.333 8H75v16h148v-16c5 0 8-3.582 8-8v-18c0-4.418-3.249-8-7.667-8z"/>
                    </svg>
                    <Link to="/">
                        Chess
                    </Link>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="hidden md:flex md:items-center md:justify-center md:gap-2">
                        {children}
                    </div>
                    {user !== null &&
                        <div className="flex flex-wrap gap-2 items-center">
                            <CircleImage src={user.profilePicture} className="h-16" onClick={onProfilePictureClicked}/>
                            <Menu>
                                <MenuButton
                                    className="inline-flex items-center gap-2 rounded-md bg-white py-1.5 px-3 text-sm/6 font-semibold text-white shadow-white/10 focus:outline-none data-[hover]:bg-white data-[open]:bg-white data-[focus]:outline-1 data-[focus]:outline-white">
                                    <ChevronDownIcon className="size-4 fill-black/60"/>
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
            </span>
        </header>
    )
}