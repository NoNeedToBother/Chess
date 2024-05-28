import React, {useState} from "react";
import {AuthMenu} from "../../components/other/AuthMenu";
import {useUserContext} from "../../../context/UserContext";
import {RegisterForm} from "../../components/form/RegisterForm";
import {useDataContext} from "../../../context/DataContext";

export function RegisterPage() {
    const { updateUser, updateJwt } = useUserContext()
    const { authService, navigator } = useDataContext()
    const [error, setError] = useState('')

    const onSubmit = async (username: string, password: string, confirmPassword: string) => {
        if (password !== confirmPassword) {
            setError("Password and confirm password field do not match")
            return
        }
        const data = await authService.register(username, password)
        if (data.user !== undefined && data.jwtInfo !== undefined) {
            updateUser(data.user)
            updateJwt(data.jwtInfo)
            navigator.navigateToMain()
        } else if (data.error !== undefined) setError(data.error)
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <AuthMenu title="Register" error={ error }>
                <RegisterForm onSubmit={ onSubmit }/>
            </AuthMenu>
        </div>
    )
}