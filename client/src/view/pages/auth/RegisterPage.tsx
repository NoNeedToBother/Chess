import React, {useEffect, useState} from "react";
import {AuthMenu} from "../../components/other/AuthMenu";
import {RegisterForm} from "../../components/form/RegisterForm";
import {useDataContext} from "../../../context/DataContext";
import {useAuthentication} from "../../../hooks/UseAuthentication";

export function RegisterPage() {
    const { navigator } = useDataContext()
    const { register, success, registerError} = useAuthentication()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (success !== null && success) navigator.navigateToMain()
    }, [success]);

    useEffect(() => {
        setError(null)
    }, [registerError]);

    const onSubmit = async (username: string, password: string, confirmPassword: string) => {
        if (password !== confirmPassword) {
            setError("Password and confirm password field do not match")
            return
        }
        register(username, password)
    }
    const getError = () => {
        if (registerError.length > 0 && error !== null) return registerError
        else if (registerError.length === 0 && error !== null) return error
        else if (registerError.length > 0) return registerError
        else if (error !== null) return error
        else return ""
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <AuthMenu title="Register" error={ getError() }>
                <RegisterForm onSubmit={ onSubmit }/>
            </AuthMenu>
        </div>
    )
}