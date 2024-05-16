import React, {useContext, useState} from "react";
import {AuthMenu} from "../../components/AuthMenu";
import {UserContext} from "../../../context/UserContext";
import {AuthService} from "../../../data/AuthService";
import {RegisterForm} from "../../components/RegisterForm";
import axios, {AxiosError} from "axios";

export function RegisterPage() {
    const { updateUser, updateJwtInfo } = useContext(UserContext)
    const [error, setError] = useState('')

    const onSubmit = async (username: string, password: string) => {
        const service = new AuthService()
        const data = await service.register(username, password)
        if (data.user !== undefined && data.jwtInfo !== undefined) {
            updateUser(data.user)
            updateJwtInfo(data.jwtInfo)
            window.location.href = "/"
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