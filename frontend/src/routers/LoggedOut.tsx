import React from "react";
import { isLoggedInVar } from "../apollo";

function LoggedOut () {
    const login = () => isLoggedInVar(true)
    return (
        <div>
            <h1> Logged out </h1>
            <button onClick={login} > Click to login </button>
        </div>
    )
}

export default LoggedOut