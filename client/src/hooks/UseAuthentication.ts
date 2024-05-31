import {useState} from "react";
import {useUserContext} from "../context/UserContext";
import {useDataContext} from "../context/DataContext";

export function useAuthentication() {
    const { updateUser, updateJwt } = useUserContext()
    const { authService } = useDataContext()

    const [ success , setSuccess] = useState<boolean | null>(null)
    const [ loginError, setLoginError ] = useState<string>("")
    const [registerError, setRegisterError] = useState<string>("")

    const login = (username: string, password: string) => {
        authService.login(username, password).then((data) => {
            if (data.user !== undefined && data.jwtInfo !== undefined) {
                updateUser(data.user)
                updateJwt(data.jwtInfo)
                setSuccess(true)
            } else if(data.error !== undefined) setLoginError(data.error)
        })
    }

    const register = (username: string, password: string) => {
        authService.register(username, password).then((data) => {
            if (data.user !== undefined && data.jwtInfo !== undefined) {
                updateUser(data.user)
                updateJwt(data.jwtInfo)
                setSuccess(true)
            } else if (data.error !== undefined) setRegisterError(data.error)
        })
    }

    return { login, register, loginError, registerError, success }
}