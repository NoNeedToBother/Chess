import { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useDataContext } from "../context/DataContext";

export function useAuthentication() {
    const { updateUser, updateJwt } = useUserContext()
    const { authService } = useDataContext()

    const [ success , setSuccess ] = useState<boolean | null>(null)
    const [ loginError, setLoginError ] = useState<string>("")
    const [ registerError, setRegisterError ] = useState<string>("")

    const [ loginProcessing, setLoginProcessing ] = useState(false)
    const [ registerProcessing, setRegisterProcessing ] = useState(false)

    const login = (username: string, password: string) => {
        setLoginProcessing(true)
        authService.login(username, password).then((data) => {
            if (data.user !== undefined && data.jwtInfo !== undefined) {
                updateUser(data.user)
                updateJwt(data.jwtInfo)
                setSuccess(true)
            } else if(data.error !== undefined) setLoginError(data.error)
            setLoginProcessing(false)
        })
    }

    const register = (username: string, password: string) => {
        setRegisterProcessing(true)
        authService.register(username, password).then((data) => {
            if (data.user !== undefined && data.jwtInfo !== undefined) {
                updateUser(data.user)
                updateJwt(data.jwtInfo)
                setSuccess(true)
            } else if (data.error !== undefined) setRegisterError(data.error)
            setRegisterProcessing(false)
        })
    }

    return { login, register, loginError, registerError, success, loginProcessing, registerProcessing }
}