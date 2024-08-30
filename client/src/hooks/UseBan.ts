import { useUserContext } from "../context/UserContext";
import { useDataContext } from "../context/DataContext";
import { useState } from "react";

export function useBan() {

    const { user, jwt } = useUserContext()
    const { userService } = useDataContext()

    const [ banResult, setBanResult ] = useState<BanResult | undefined>(undefined)
    const [ unbanResult, setUnbanResult ] = useState<BanResult | undefined>(undefined)

    const ban = (reason: string, bannedId: number) => {
        if (user !== null && jwt !== null) {
            userService.ban(
                { from: user, bannedId: bannedId, reason: reason },
                jwt
            ).then((res) => {
                if (res.error !== undefined) setBanResult({ status: false, error: res.error })
                else setBanResult({ status: true })
            })
        }
    }

    const unban = (bannedId: number) => {
        if (user !== null && jwt !== null) {
            userService.unban(
                user, bannedId, jwt
            ).then((res) => {
                if (res.error !== undefined) setUnbanResult({ status: false, error: res.error })
                else setUnbanResult({ status: true })
            })
        }
    }

    return { banResult, unbanResult, ban, unban }
}

interface BanResult {
    status: boolean
    error?: string
}