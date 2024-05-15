import React, {createContext, useState} from "react";
import {User} from "../models/User";
import {JwtInfo} from "../models/JwtInfo";

interface IUserContext {
    getUser: () => (User | null)
    updateUser: (u: User) => void;
    clearUser: () => void;
    getJwtInfo: () => (JwtInfo | null);
    updateJwtInfo: (jwt: JwtInfo) => void;
}

export const UserContext = createContext<IUserContext>({
    getUser: () => { return null },
    updateUser: () => {},
    clearUser: () => {},
    getJwtInfo: () => { return null },
    updateJwtInfo: () => {}
})

export const UserState = ({ children }: {children: React.ReactNode}) => {
    const [userState, setUser] =
        useState<{user: null | User}>({user: null})

    const [jwtState, setJwtInfo] =
        useState<{ jwt: null | JwtInfo }>({ jwt: null })

    const updateUser = (u: User) => setUser({user: u })

    const clearUser = () => setUser({ user: null })

    const updateJwt = (jwt: JwtInfo) => setJwtInfo({ jwt: jwt })

    const context = new class implements IUserContext {
        clearUser(): void { clearUser() }
        updateUser(u: User): void { updateUser(u)}
        getUser(): User | null {
            return userState.user;
        }
        getJwtInfo(): JwtInfo | null {
            return jwtState.jwt
        }
        updateJwtInfo(jwt: JwtInfo): void { updateJwt(jwt) }
    }()

    return(
        <UserContext.Provider value={context}>
            { children }
        </UserContext.Provider>
    )
}