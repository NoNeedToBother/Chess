import React from 'react';
import {Route, Routes} from "react-router-dom";
import {LoginPage} from "./view/pages/auth/LoginPage";
import {RegisterPage} from "./view/pages/auth/RegisterPage";
import {MainPage} from "./view/pages/MainPage";
import {NavItem} from "./view/components/nav/NavItem";
import {NavBar} from "./view/components/nav/NavBar";
import {useUserContext} from "./context/UserContext";

function App() {
    const { user } = useUserContext()

    return (
        <>
            { user !== null &&
                <NavBar>
                    <NavItem href="/posts" name="Posts"/>
                    <NavItem href="/upload/post" name="Upload post"/>
                </NavBar>
            }
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/" element={<MainPage/>}/>
            </Routes>
        </>

    );
}

export default App;
