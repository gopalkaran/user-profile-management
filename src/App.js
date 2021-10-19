import React from 'react';
import './App.css';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Reset from './components/Reset';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
         <Route path="/" exact component={Login} />
         <Route path="/signup" component={SignUp} />
         <Route path="/dashboard" component={Dashboard} />
         <Route path="/reset" component={Reset} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
