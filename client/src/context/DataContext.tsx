import {AuthService} from "../data/service/AuthService";
import {PostService} from "../data/service/PostService";
import React, {createContext, useContext} from "react";
import {RoleMapper, UserMapper} from "../data/mapper/UserMapper";
import {UrlFormatter} from "../utils/UrlFormatter";
import {useNavigate} from "react-router-dom";
import {Navigator} from "../utils/Navigator";

interface IDataContext {
    authService: AuthService;
    postService: PostService;
    navigator: Navigator;
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
    const urlFormatter = new UrlFormatter()
    const postService = new PostService(urlFormatter, userMapper)
    const navigate = useNavigate()
    const navigator = new Navigator(navigate)
    return(
        <DataContextProvider value={{authService, postService, navigator}}>
            { children }
        </DataContextProvider>
    )
}