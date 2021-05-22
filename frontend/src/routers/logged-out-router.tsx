import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { CreateAccount, Login } from "../pages";

function LoggedOut () {
    return (
        <Router>
            <Switch>
                <Route exact path='/' > <Login /> </Route>
                <Route path='/signup' > <CreateAccount /> </Route>
            </Switch>
        </Router>
    )
}

export default LoggedOut