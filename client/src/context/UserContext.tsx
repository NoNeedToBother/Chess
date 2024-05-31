import React, {createContext, useContext, useState} from "react";
import {User} from "../models/User";
import {JwtInfo} from "../models/JwtInfo";

interface IUserContext {
    user: User | null;
    updateUser: (u: User) => void;
    clearUser: () => void;
    jwt: JwtInfo | null;
    updateJwt: (jwt: JwtInfo) => void;
    opponent: User | null;
    setOpponent: (u: User | null) => void;
}

const UserContext = createContext<IUserContext | null>(null)

export const UserContextProvider = UserContext.Provider

export const useUserContext = () => {
    const data = useContext(UserContext)
    if (!data) {
        throw new Error("Attempt to call UserContext outside of the provider")
    }
    return data;
}

export const UserState = ({ children }: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)
    const [ opponent, setOpponent ] = useState<User | null>(null)
    const [jwt, setJwt] = useState<JwtInfo | null>(null)
    const clearUser = () => { setUser(null) }
    return(
        <UserContextProvider value={{user, updateUser: setUser, clearUser, jwt, updateJwt: setJwt, opponent, setOpponent}}>
            { children }
        </UserContextProvider>
    )
}