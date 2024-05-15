import React from 'react';
import {Route, Routes} from "react-router-dom";
import {LoginPage} from "./view/pages/auth/LoginPage";
import {RegisterPage} from "./view/pages/auth/RegisterPage";
import {MainPage} from "./view/pages/MainPage";

function App() {
  return (
    <Routes>
        <Route path="/login" element={ <LoginPage/> } />
        <Route path="/register" element={ <RegisterPage/> } />
        <Route path="/" element={ <MainPage/> } />
    </Routes>
  );
}

export default App;
