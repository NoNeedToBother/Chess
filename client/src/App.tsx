import React, {useEffect} from 'react';
import {Route, Routes} from "react-router-dom";
import {LoginPage} from "./view/pages/auth/LoginPage";
import {RegisterPage} from "./view/pages/auth/RegisterPage";
import {MainPage} from "./view/pages/MainPage";
import {NavItem} from "./view/components/nav/NavItem";
import {NavBar} from "./view/components/nav/NavBar";
import {useUserContext} from "./context/UserContext";
import {useDataContext} from "./context/DataContext";
import {PostPage} from "./view/pages/posts/PostPage";
import {PostsPage} from "./view/pages/posts/PostsPage";
import {UploadPostPage} from "./view/pages/posts/UploadPostPage";

function App() {
    const { user, clearUser } = useUserContext()
    const { navigator } = useDataContext()

    const onLogout = () => {
        clearUser()
    }
    useEffect(() => {
        if (user === null) {
            navigator.navigateToLogin()
        }
    }, [user]);
    return (
        <>
            { user !== null &&
                <NavBar user={ user } onLogout={ onLogout } navigator={ navigator }>
                    <NavItem href="/posts" name="Posts"/>
                    <NavItem href="/post/upload" name="Upload post"/>
                </NavBar>
            }
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/post/:id" element={<PostPage/>}/>
                <Route path="/posts" element={<PostsPage/>}/>
                <Route path="/post/upload" element={ <UploadPostPage/>}/>
            </Routes>
        </>

    );
}

export default App;
