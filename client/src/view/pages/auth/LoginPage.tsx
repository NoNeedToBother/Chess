import React, {useContext, useState} from "react";
import {AuthMenu} from "../../components/AuthMenu";
import {LoginForm} from "../../components/LoginForm";
import {AuthService} from "../../../data/AuthService";
import {UserContext} from "../../../context/UserContext";

export function LoginPage() {
    const { updateUser, updateJwtInfo } = useContext(UserContext)

    const onSubmit = async (username: string, password: string) => {
        const service = new AuthService()
        const data = await service.login(username, password)
        if (data.user !== undefined && data.jwtInfo !== undefined) {
            updateUser(data.user)
            updateJwtInfo(data.jwtInfo)
            window.location.href = "/"
        } else {
            alert(data.error)
        }
    }

    return (
        <>
            <AuthMenu title="Login">
                <LoginForm onSubmit={ onSubmit }/>
            </AuthMenu>
        </>

    )
}