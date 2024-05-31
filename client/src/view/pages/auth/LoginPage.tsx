import React, {useEffect} from "react";
import {AuthMenu} from "../../components/other/AuthMenu";
import {LoginForm} from "../../components/form/LoginForm";
import {useDataContext} from "../../../context/DataContext";
import {useAuthentication} from "../../../hooks/UseAuthentication";

export function LoginPage() {
    const { navigator } = useDataContext()
    const { login, success, loginError} = useAuthentication()

    const onSubmit = (username: string, password: string) => login(username, password)

    useEffect(() => {
        if (success !== null && success) navigator.navigateToMain()
    }, [success]);

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <AuthMenu title="Login" error={ loginError }>
                <LoginForm onSubmit={ onSubmit }/>
            </AuthMenu>
        </div>
    )
}