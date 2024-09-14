import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { NavBar } from "./NavBar";
import { NavItem } from "./NavItem";
import { useUserContext } from "../../../context/UserContext";
import { useDataContext } from "../../../context/DataContext";
import { useChessContext } from "../../../context/ChessContext";

enum ActiveNavItem {
    NOTHING = "",
    UPLOAD_POST = "upload_post",
    POSTS = "posts",
    DAILY_PUZZLE = "daily_puzzle"
}

export function MainNavigationBar() {
    const { user, clearUser } = useUserContext()
    const { navigator } = useDataContext()

    const { chessService, clearChess, gameInfo } = useChessContext()

    const location = useLocation()
    const [ activeNavItem, setActiveNavItem ] = useState(ActiveNavItem.NOTHING)

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
        if (location.pathname === "/puzzle/daily") setActiveNavItem(ActiveNavItem.DAILY_PUZZLE)
        else if (location.pathname === "/post/upload") setActiveNavItem(ActiveNavItem.UPLOAD_POST)
        else if (location.pathname === "/posts") setActiveNavItem(ActiveNavItem.POSTS)
        else setActiveNavItem(ActiveNavItem.NOTHING)
    }, [location]);

    return <>
        { user !== null &&
            <NavBar user={ user } onLogout={ onLogout } navigator={ navigator }>
                <NavItem href="/puzzle/daily" name="DAILY PUZZLE" active={ activeNavItem === ActiveNavItem.DAILY_PUZZLE }/>
                <NavItem href="/posts" name="POSTS" active={ activeNavItem === ActiveNavItem.POSTS }/>
                <NavItem href="/post/upload" name="UPLOAD POST" active={ activeNavItem === ActiveNavItem.UPLOAD_POST }/>
            </NavBar>
        }
    </>
}