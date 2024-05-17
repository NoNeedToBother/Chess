import {AuthService} from "../data/AuthService";
import {PostService} from "../data/PostService";
import React, {createContext, useContext, useState} from "react";
import {RoleMapper, UserMapper} from "../data/mapper/UserMapper";

interface IDataContext {
    authService: AuthService;
    postService: PostService;
}

const DataContext = createContext<IDataContext | null>(null)

export const DataContextProvider = DataContext.Provider

export const useDataContext = () => {
    const data = useContext(DataContext)
    if (!data) {
        throw new Error("Attempt to call DataContext outside of the provider")
    }
    return data
}

export const Data = ({ children }: {children: React.ReactNode}) => {
    const roleMapper = new RoleMapper()
    const userMapper = new UserMapper(roleMapper)
    const authService = new AuthService(userMapper)
    const postService = new PostService()
    return(
        <DataContextProvider value={{authService, postService}}>
            { children }
        </DataContextProvider>
    )
}