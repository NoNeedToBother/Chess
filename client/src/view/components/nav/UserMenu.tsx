import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import React from "react";
import { Navigator } from "../../../utils/Navigator";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

interface UserMenuProps {
    navigator: Navigator;
    onLogout?: () => void;
}

export function UserMenu({ navigator, onLogout }: UserMenuProps) {
    const profileClickedHandler = () => navigator.navigateToProfile()
    const logoutClickedHandler = () => onLogout?.()
    const postsClickedHandler = () => navigator.navigateToPosts()
    const uploadPostClickedHandler = () => navigator.navigateToUploadPost()

    return <Menu>
        <MenuButton
            className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold text-white shadow-white/10 focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white">
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
                    <button onClick={ postsClickedHandler }
                            className="md:hidden group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 text-black">
                        All posts
                    </button>
                </MenuItem>
                <MenuItem>
                    <button onClick={ uploadPostClickedHandler }
                            className="md:hidden group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 text-black">
                        Upload post
                    </button>
                </MenuItem>
                <MenuItem>
                    <button onClick={ profileClickedHandler }
                            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 text-black">
                        Profile
                    </button>
                </MenuItem>
                <div className="my-1 h-px bg-black/5"/>
                <MenuItem>
                    <button onClick={ logoutClickedHandler }
                            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 text-red-400">
                        Logout
                    </button>
                </MenuItem>
            </MenuItems>
        </Transition>
    </Menu>
}
