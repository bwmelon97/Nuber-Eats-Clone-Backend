import React from "react";
import { isLoggedInVar } from "@apollo-client";

function LoggedIn () {
    const logout = () => isLoggedInVar(false)
    return (
        <div>
            <h1> Logged in </h1>
            <button onClick={logout} > Click to logout </button>
        </div>
    )
}

export default LoggedIn