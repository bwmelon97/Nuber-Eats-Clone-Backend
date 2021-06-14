import React from "react";
// import { authTokenVar, isLoggedInVar } from "@apollo-client";
// import { AUTH_TOKEN } from "@constants";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { MeQuery } from "@gql-types/MeQuery";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { NotFound } from "@pages";
import { UserRole } from "@gql-types/globalTypes";
import { ClientRouter } from "./logged-in-routers";

const ME_QUERY = gql`
    query MeQuery {
        me {
            id
            email
            role
        }
    }
`;

function LoggedInRouter () {
    
    const { loading, data } = useQuery<MeQuery>(ME_QUERY)
    // const logout = () => {
    //     localStorage.setItem(AUTH_TOKEN, '')
    //     authTokenVar(null)
    //     isLoggedInVar(false)
    // }

    if ( !data || loading ) {
        return (
            <div className='flex justify-center items-center text-xl' >
                loading...
            </div>
        )
    }

    const { me: { role } } = data;

    return (
        <Router>
            { role === UserRole.Client && <ClientRouter /> }
            <Route> <NotFound /> </Route>
        </Router>
    )
}

export default LoggedInRouter