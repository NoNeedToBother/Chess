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
        this.navigation("/login")
    }

    navigateToProfile() {
        this.navigation("/profile")
    }

    navigateToPosts() {
        this.navigation("/posts")
    }

    navigateToUploadPost() {
        this.navigation("/post/upload")
    }
}