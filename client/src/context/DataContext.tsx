import {AuthService} from "../data/service/AuthService";
import {PostService} from "../data/service/PostService";
import React, {createContext, useContext} from "react";
import {RoleMapper, UserMapper} from "../data/mapper/UserMapper";
import {UrlFormatter} from "../utils/UrlFormatter";
import {useNavigate} from "react-router-dom";
import {Navigator} from "../utils/Navigator";
import {CommentService} from "../data/service/CommentService";
import {PostMapper} from "../data/mapper/PostMapper";
import {CommentMapper} from "../data/mapper/CommentMapper";

interface IDataContext {
    authService: AuthService;
    postService: PostService;
    commentService: CommentService;
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
    const postMapper = new PostMapper(userMapper)
    const commentMapper = new CommentMapper(userMapper)

    const authService = new AuthService(userMapper)
    const urlFormatter = new UrlFormatter()
    const postService = new PostService(urlFormatter, userMapper, postMapper, commentMapper)
    const navigate = useNavigate()
    const navigator = new Navigator(navigate)
    const commentService = new CommentService(urlFormatter, commentMapper)
    return(
        <DataContextProvider value={{authService, postService, commentService, navigator}}>
            { children }
        </DataContextProvider>
    )
}