import React, { useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./view/pages/auth/LoginPage";
import { RegisterPage } from "./view/pages/auth/RegisterPage";
import { ChessPage } from "./view/pages/chess/ChessPage";
import { useUserContext } from "./context/UserContext";
import { useDataContext } from "./context/DataContext";
import { PostPage } from "./view/pages/posts/PostPage";
import { PostsPage } from "./view/pages/posts/PostsPage";
import { UploadPostPage } from "./view/pages/posts/UploadPostPage";
import { ProfilePage } from "./view/pages/profile/ProfilePage";
import { OtherUserProfilePage } from "./view/pages/profile/OtherUserProfilePage";
import { useChessContext } from "./context/ChessContext";
import { Modal } from "./view/components/base/Modal";
import { ChessBackground } from "./view/components/base/ChessBackground";
import { DailyPuzzlePage } from "./view/pages/chess/DailyPuzzlePage";
import { MainNavigationBar } from "./view/components/nav/MainNavigationBar";
import { Background } from "./view/components/base/Background";

function App() {
    const { user, justBannedInfo, setJustBannedInfo } = useUserContext()
    const { navigator } = useDataContext()

    const { chessService } = useChessContext()

    const onBanModalClose = () => setJustBannedInfo(undefined)

    useEffect(() => {
        if (user === null) {
            navigator.navigateToLogin()
        } else {
            chessService.connect(user.id)
        }
    }, [user])

    return (
        <>
            <MainNavigationBar/>
            { justBannedInfo &&
                <Modal title="You were banned" onClose={ onBanModalClose }/>
            }
            <Routes>
                <Route path="/login" element={ <LoginPage/> }/>
                <Route path="/register" element={ <RegisterPage/> }/>
                <Route path="/" element={ <ChessPage/> }/>
                <Route path="/post/:id" element={ <PostPage/> }/>
                <Route path="/posts" element={ <PostsPage/> }/>
                <Route path="/post/upload" element={ <UploadPostPage/> }/>
                <Route path="/profile" element={ <ProfilePage/> }/>
                <Route path="/profile/:id" element={ <OtherUserProfilePage/> }/>
                <Route path="/puzzle/daily" element={ <DailyPuzzlePage/> }/>
            </Routes>
            <ChessBackground/>
            <Background/>
        </>
    )
}

export default App;
