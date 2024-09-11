import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import { LoginPage } from "./view/pages/auth/LoginPage";
import { RegisterPage } from "./view/pages/auth/RegisterPage";
import { MainPage } from "./view/pages/MainPage";
import { NavItem } from "./view/components/nav/NavItem";
import { NavBar } from "./view/components/nav/NavBar";
import { useUserContext } from "./context/UserContext";
import { useDataContext } from "./context/DataContext";
import { PostPage } from "./view/pages/posts/PostPage";
import { PostsPage } from "./view/pages/posts/PostsPage";
import { UploadPostPage } from "./view/pages/posts/UploadPostPage";
import { ProfilePage } from "./view/pages/profile/ProfilePage";
import { OtherUserProfilePage } from "./view/pages/profile/OtherUserProfilePage";
import { useChessContext } from "./context/ChessContext";
import { Modal } from "./view/components/base/Modal";

function App() {
    const { user, clearUser, justBannedInfo, setJustBannedInfo } = useUserContext()
    const { navigator } = useDataContext()

    const { chessService, clearChess, gameInfo } = useChessContext()

    const location = useLocation()
    const [ activeNavItem, setActiveNavItem ] = useState("")

    useEffect(() => {
        if (location.pathname === "/") setActiveNavItem("play")
        else if (location.pathname === "/post/upload") setActiveNavItem("upload")
        else if (location.pathname === "/posts") setActiveNavItem("posts")
        else setActiveNavItem("")
    }, [location]);

    const onBanModalClose = () => setJustBannedInfo(undefined)

    const onLogout = () => {
        if (gameInfo.gameId !== null && user !== null) {
            chessService.concede({
                gameId: gameInfo.gameId, from: user.id, reason: "disconnect"
            })
        }
        else chessService.disconnect()
        clearUser()
        clearChess()
    }

    useEffect(() => {
        if (user === null) {
            navigator.navigateToLogin()
        } else {
            chessService.connect(user.id)
        }
    }, [user])

    return (
        <>
            { user !== null &&
                <NavBar user={ user } onLogout={ onLogout } navigator={ navigator }>
                    <NavItem href="/" name="PLAY" active={ activeNavItem === "play" }/>
                    <NavItem href="/posts" name="POSTS" active={ activeNavItem === "posts" }/>
                    <NavItem href="/post/upload" name="UPLOAD POST" active={ activeNavItem === "upload" }/>
                </NavBar>
            }
            { justBannedInfo &&
                <Modal title="You were banned" onClose={ onBanModalClose }/>
            }
            <Routes>
                <Route path="/login" element={ <LoginPage/> }/>
                <Route path="/register" element={ <RegisterPage/> }/>
                <Route path="/" element={ <MainPage/> }/>
                <Route path="/post/:id" element={ <PostPage/> }/>
                <Route path="/posts" element={ <PostsPage/> }/>
                <Route path="/post/upload" element={ <UploadPostPage/> }/>
                <Route path="/profile" element={ <ProfilePage/> }/>
                <Route path="/profile/:id" element={ <OtherUserProfilePage/> }/>
            </Routes>
        </>

    );
}

export default App;
