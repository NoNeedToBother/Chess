import React, {createContext, useContext, useState} from "react";
import {User} from "../models/User";
import {JwtInfo} from "../models/JwtInfo";

interface IUserContext {
    user: User | null;
    setUser: (u: User) => void;
    jwt: JwtInfo | null;
    setJwt: (jwt: JwtInfo) => void;
}

const UserContext = createContext<IUserContext | null>(null)

export const UserContextProvider = UserContext.Provider

export const useUserContext = () => {
    const data = useContext(UserContext)
    if (!data) {
        throw new Error("Attempt to call outside of the provider")
    }
    return data;
}

export const UserState = ({ children }: {children: React.ReactNode}) => {
    const [user, setUser] =
        useState<User | null>(null)
    const [jwt, setJwt] =
        useState<JwtInfo | null>(null)
    return(
        <UserContextProvider value={{user, setUser, jwt, setJwt}}>
            { children }
        </UserContextProvider>
    )
}