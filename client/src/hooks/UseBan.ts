import {useUserContext} from "../context/UserContext";
import {useDataContext} from "../context/DataContext";
import {useState} from "react";

export function useBan() {

    const { user, jwt } = useUserContext()
    const { userService } = useDataContext()

    const [result, setResult] = useState<BanResult | undefined>(undefined)

    const ban = (reason: string, bannedId: number) => {
        if (user !== null && jwt !== null) {
            userService.ban(
                { from: user, bannedId: bannedId, reason: reason },
                jwt
            ).then((res) => {
                if (res.error !== undefined) setResult({ status: false, error: res.error })
                else setResult({ status: true })
            })
        }
    }

    return { result, ban }
}

interface BanResult {
    status: boolean
    error?: string
}