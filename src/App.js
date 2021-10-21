import React from "react";
import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Reset from "./components/Reset";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import UpdateProfile from "./components/UpdateProfile";

function App() {
  return (
    <Router>
      <div className="App">
        <AuthProvider>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/signup" component={SignUp} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <PrivateRoute path="/update-profile" component={UpdateProfile} />
            <Route path="/reset" component={Reset} />
          </Switch>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
