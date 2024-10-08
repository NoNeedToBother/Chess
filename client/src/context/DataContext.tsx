import { AuthService } from "../data/service/AuthService";
import { PostService } from "../data/service/PostService";
import React, { createContext, useContext } from "react";
import { RoleMapper, UserMapper } from "../data/mapper/UserMapper";
import { UrlFormatter } from "../utils/UrlFormatter";
import { useNavigate } from "react-router-dom";
import { Navigator } from "../utils/Navigator";
import { CommentService } from "../data/service/CommentService";
import { PostMapper } from "../data/mapper/PostMapper";
import { CommentMapper } from "../data/mapper/CommentMapper";
import { UserService } from "../data/service/UserService";
import { JwtInfo } from "../models/JwtInfo";
import { useUserContext } from "./UserContext";
import { ChessApiService } from "../data/service/ChessApiService";

interface IDataContext {
    authService: AuthService
    postService: PostService
    userService: UserService
    commentService: CommentService
    chessApiService: ChessApiService
    navigator: Navigator
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

export const Data = ({ children }: { children: React.ReactNode }) => {
    const roleMapper = new RoleMapper()
    const userMapper = new UserMapper(roleMapper)
    const postMapper = new PostMapper(userMapper)
    const commentMapper = new CommentMapper(userMapper)

    const authService = new AuthService(userMapper)
    const urlFormatter = new UrlFormatter()
    const postService = new PostService(urlFormatter, postMapper, commentMapper)
    const commentService = new CommentService(commentMapper)
    const userService = new UserService(urlFormatter, postMapper, userMapper)
    const chessApiService = new ChessApiService()

    const navigate = useNavigate()
    const navigator = new Navigator(navigate)

    const { updateJwt, clearUser, setJustBannedInfo } = useUserContext()
    const onTokenRefreshed = (jwt: JwtInfo) => updateJwt(jwt)
    const onUserBanned = () => {
        setJustBannedInfo(true)
        clearUser()
    }

    postService.setOnTokenRefreshedListener(onTokenRefreshed)
    commentService.setOnTokenRefreshedListener(onTokenRefreshed)
    userService.setOnTokenRefreshedListener(onTokenRefreshed)
    chessApiService.setOnTokenRefreshedListener(onTokenRefreshed)

    postService.setOnUserBannedListener(onUserBanned)
    commentService.setOnUserBannedListener(onUserBanned)
    userService.setOnUserBannedListener(onUserBanned)
    chessApiService.setOnTokenRefreshedListener(onUserBanned)

    return(
        <DataContextProvider value={ {authService, postService, userService, commentService, chessApiService, navigator} }>
            { children }
        </DataContextProvider>
    )
}