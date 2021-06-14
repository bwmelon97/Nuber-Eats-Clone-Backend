import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { CreateAccount, Login, NotFound } from "@pages";

function LoggedOutRouter () {
    return (
        <Router>
            <Switch>
                <Route exact path='/' > <Login /> </Route>
                <Route path='/signup' > <CreateAccount /> </Route>
                <Route> <NotFound /> </Route>
            </Switch>
        </Router>
    )
}

export default LoggedOutRouter