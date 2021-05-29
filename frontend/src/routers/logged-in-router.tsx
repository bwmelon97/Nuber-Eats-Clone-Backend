import React from "react";
import { authTokenVar, isLoggedInVar } from "@apollo-client";
import { AUTH_TOKEN } from "@constants";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { MeQuery } from "@gql-types/MeQuery";

const ME_QUERY = gql`
    query MeQuery {
        me {
            id
            email
            role
        }
    }
`;

function LoggedIn () {
    
    const { loading, data, error } = useQuery<MeQuery>(ME_QUERY)

    const logout = () => {
        localStorage.setItem(AUTH_TOKEN, '')
        authTokenVar(null)
        isLoggedInVar(false)
    }

    return (
        <div>
            <h1> Logged in </h1>
            <div>
                { data?.me.id }
                { data?.me.email }
                { data?.me.role }
            </div>
            <button onClick={logout} > Click to logout </button>
        </div>
    )
}

export default LoggedIn