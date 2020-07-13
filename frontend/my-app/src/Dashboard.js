import React from 'react';
import axios from 'axios';
import './Dashboard.css';
import {
    Redirect
} from "react-router-dom";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
          loggedInStatus: "NOT_LOGGED_IN",
          user: "",
          hasChecked: false
        };
    
        this.checkLoginStatus = this.checkLoginStatus.bind(this);
        this.signOut = this.signOut.bind(this);
    }

    checkLoginStatus() {
        axios.get("https://54.71.38.110:8443/login", { withCredentials: true })
        .then(response => {
            if (this._isMounted && response.data.logged_in) {
                this.setState({
                    loggedInStatus: "LOGGED_IN",
                    user: response.data.user,
                    hasChecked: true
                });
            } else if (this._isMounted && !response.data.logged_in) {
                this.setState({
                    loggedInStatus: "NOT_LOGGED_IN",
                    user: "",
                    hasChecked: true
                });
            }
        })
        .catch(error => {
            console.log("check login error", error);
        });
    }

    signOut() {
        let data = JSON.stringify({
            type: "signOut",
            username: "",
            password: ""
        });
        axios.post('https://54.71.38.110:8443/login', data, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
        }).then(response => {
            //For debugging same session vs another session
            //console.log(response.data.count);
            this.checkLoginStatus();
        }) 
    }


    componentDidMount() {
        this._isMounted = true;
        this.checkLoginStatus();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }



    render() {
        if(this.state.loggedInStatus === "NOT_LOGGED_IN" && this.state.hasChecked) {
            return <Redirect push to='/'/>;
        } else if (this.state.loggedInStatus === "NOT_LOGGED_IN") {
            return (
                <div>Checking Credentials</div>
            );
        }
        return (
          <div className="Dashboard">
            <button className="signOut" onClick={this.signOut}>Sign Out</button>
          </div>
        );
    }
}

export default Dashboard;
