import React from "react";
import { authTokenVar, isLoggedInVar } from "@apollo-client";
import { AUTH_TOKEN } from "@constants";

function LoggedIn () {
    const logout = () => {
        localStorage.setItem(AUTH_TOKEN, '')
        authTokenVar(null)
        isLoggedInVar(false)
    }
    return (
        <div>
            <h1> Logged in </h1>
            <button onClick={logout} > Click to logout </button>
        </div>
    )
}

export default LoggedIn