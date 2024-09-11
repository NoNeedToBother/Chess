import React from "react";
import { Role } from "../../../models/Role";

export interface RoleLabelProps {
    roles: Role[]
}

export function RoleLabel({ roles }: RoleLabelProps) {
    const getUserRole = () => {
        if (roles.includes(Role.CHIEF_ADMIN)) return "Chief administrator"
        if (roles.includes(Role.ADMIN)) return "Administrator"
        if (roles.includes(Role.MODERATOR)) return "Moderator"
        return ""
    }
    const getUserRoleText = () => {
        if (roles.includes(Role.CHIEF_ADMIN)) return "text-purple-700 gradient-text"
        if (roles.includes(Role.ADMIN)) return "text-red-400"
        if (roles.includes(Role.MODERATOR)) return "text-green-300"
        return ""
    }
    return <h1
        className={
            `w-full text-left my-4 sm:mx-4 xs:pl-4 text-gray-800 dark:text-white lg:text-4xl md:text-3xl sm:text-3xl xs:text-xl font-serif ${ getUserRoleText() }`
        }>
        { getUserRole() }</h1>
}