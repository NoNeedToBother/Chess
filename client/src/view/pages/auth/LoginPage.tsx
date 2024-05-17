import React, {useState} from "react";
import {AuthMenu} from "../../components/AuthMenu";
import {LoginForm} from "../../components/form/LoginForm";
import {useUserContext} from "../../../context/UserContext";
import {useNavigate} from "react-router-dom";
import {useDataContext} from "../../../context/DataContext";

export function LoginPage() {
    const { setUser, setJwt } = useUserContext()
    const { authService } = useDataContext()
    const [error, setError] = useState('')
    const navigate = useNavigate();

    const onSubmit = async (username: string, password: string) => {
        const data = await authService.login(username, password)

        if (data.user !== undefined && data.jwtInfo !== undefined) {
            setUser(data.user)
            setJwt(data.jwtInfo)
            navigate("/")
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