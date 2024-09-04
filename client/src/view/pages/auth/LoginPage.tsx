import React, { useEffect } from "react";
import { AuthMenu } from "../../components/other/AuthMenu";
import { LoginForm } from "../../components/form/LoginForm";
import { useDataContext } from "../../../context/DataContext";
import { useAuthentication } from "../../../hooks/UseAuthentication";
import { CircularProgress } from "@mui/material";
import { ChessLogo } from "../../components/base/ChessLogo";

export function LoginPage() {
    const { navigator } = useDataContext()
    const { login, success, loginError, loginProcessing } = useAuthentication()

    const onSubmit = (username: string, password: string) => login(username, password)

    useEffect(() => {
        if (success !== null && success) navigator.navigateToMain()
    }, [success]);

    const onGoRegisterClickHandler = () => navigator.navigateToRegister()

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="mx-auto">
                <ChessLogo interactable={ false } className="text-8xl"/>
            </div>
            <AuthMenu title="Login" error={ loginError }>
                <LoginForm onSubmit={ onSubmit }/>
                <button type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 my-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={ onGoRegisterClickHandler }
                >Go to register
                </button>
                { loginProcessing &&
                    <div className="flex justify-center">
                        <CircularProgress/>
                    </div>
                }
            </AuthMenu>
        </div>
    )
}