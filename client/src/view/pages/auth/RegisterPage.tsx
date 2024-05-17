import React, {useState} from "react";
import {AuthMenu} from "../../components/AuthMenu";
import {useUserContext} from "../../../context/UserContext";
import {AuthService} from "../../../data/AuthService";
import {RegisterForm} from "../../components/form/RegisterForm";
import {useNavigate} from "react-router-dom";

export function RegisterPage() {
    const { setUser, setJwt } = useUserContext()
    const [error, setError] = useState('')
    const navigate = useNavigate();

    const onSubmit = async (username: string, password: string) => {
        const service = new AuthService()
        const data = await service.register(username, password)
        if (data.user !== undefined && data.jwtInfo !== undefined) {
            setUser(data.user)
            setJwt(data.jwtInfo)
            navigate("/")
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