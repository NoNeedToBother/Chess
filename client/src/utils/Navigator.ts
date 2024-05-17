import {NavigateFunction} from "react-router-dom";

export class Navigator {
    private readonly navigation: NavigateFunction

    constructor(navigation: NavigateFunction) {
        this.navigation = navigation
    }

    navigateToMain() {
        this.navigation("/")
    }

    navigateToPost(id: number) {
        this.navigation(`/post/${id}`)
    }

    navigateToLogin() {

    }
}