import React, { useState } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';
import MobileDashboard from './MobileDashboard';
import Home from './Home';
import MediaQuery from 'react-responsive';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInStatus: "NOT_LOGGED_IN",
      user: ""
    };
  }
  
  componentDidMount() {
    
  }

  
  componentWillUnmount() {
    
  }



  render() {

    function About() {
      return (
        <div>
          <h2>About</h2>
        </div>
      );
    }    

    return (
      <Router>
      <Switch>
        <Route exact path="/">
            <Home/>
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/dashboard">
            <MediaQuery query='(min-device-width: 1224px)'>
              <Dashboard/>
            </MediaQuery>
            <MediaQuery query='(max-device-width: 1224px)'>
              <MobileDashboard/>
            </MediaQuery>
          </Route>
      </Switch>
      </Router>
    );
  }

}

export default App;
