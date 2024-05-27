import React, {useState} from "react";
import {AuthMenu} from "../../components/AuthMenu";
import {LoginForm} from "../../components/form/LoginForm";
import {useUserContext} from "../../../context/UserContext";
import {useDataContext} from "../../../context/DataContext";

export function LoginPage() {
    const { updateUser, updateJwt } = useUserContext()
    const { authService, navigator } = useDataContext()
    const [error, setError] = useState('')
    const onSubmit = async (username: string, password: string) => {
        const data = await authService.login(username, password)
        if (data.user !== undefined && data.jwtInfo !== undefined) {
            updateUser(data.user)
            updateJwt(data.jwtInfo)
            navigator.navigateToMain()
        } else if(data.error !== undefined) setError(data.error)
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <AuthMenu title="Login" error={ error }>
                <LoginForm onSubmit={ onSubmit }/>
            </AuthMenu>
        </div>
    )
}