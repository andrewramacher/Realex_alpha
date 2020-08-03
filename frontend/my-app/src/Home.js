import React from 'react';
import axios from 'axios';
import './Home.css';
import SignIn from './SignIn';
import mh_logo from './images/moneyhouse_transparent.png';
import p_logo from './images/Elegant.png';
import {
    Redirect
} from "react-router-dom";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          width:  432,
          height: 288,
          signInCLicked: false,
          loggedInStatus: "NOT_LOGGED_IN",
          user: ""
        };
    
        this.updateSignInClicked = this.updateSignInClicked.bind(this);
        this.checkLoginStatus = this.checkLoginStatus.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    updateSignInClicked() {
        let newval = true;
        if(this.state.signInCLicked) {
          newval = false;
        }
        this.setState({signInCLicked: newval});
    }

    updateDimensions() {
        if(window.innerWidth < 500) {
          this.setState({ width: 216, height: 144 });
        } else {
          let update_width  = Math.floor((432 * window.innerWidth) / 1000);
          let update_height = Math.floor((288 * window.innerWidth) / 1000);
          this.setState({ width: update_width, height: update_height });
        }
    }

    checkLoginStatus() {
        axios.get("https://www.realexinvest.com:8443/login", { withCredentials: true })
        .then(response => {
            if (
              response.data.logged_in &&
              this.state.loggedInStatus === "NOT_LOGGED_IN"
            ) {
              this.setState({
                loggedInStatus: "LOGGED_IN",
                user: response.data.user
              });
            } else if (
              !response.data.logged_in &&
              this.state.loggedInStatus === "LOGGED_IN"
            ) {
              this.setState({
                loggedInStatus: "NOT_LOGGED_IN",
                user: ""
              });
            }
            //console.log(this.state.loggedInStatus);
        })
        .catch(error => {
            console.log("check login error", error);
        });
    }

    onSubmit(username, password) {
        let data = JSON.stringify({
          type: "signIn",
          username: username,
          password: password
        });
        axios.post('https://www.realexinvest.com:8443/login', data, {
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
        this.updateDimensions();
        this.checkLoginStatus();
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }



    render() {

        if(this.state.loggedInStatus === "LOGGED_IN") {
            return <Redirect push to='/dashboard'/>;
        }

        //Handle displaying sign in screen
        let signInScreen;
        if(this.state.signInCLicked) {
        signInScreen = <SignIn onSubmit={this.onSubmit}/>;
        }
        
        return (
            <div className="App">
              <header className="App-header">
                <button className="small"><img className="small" src={mh_logo} alt="my image" onClick={this.sendIt} /></button>
                <img className="plant" height={this.state.height} width={this.state.width} src={p_logo} alt="P_logo"/>
                <div className="name">REAL EXPRESS</div>
                <button className="signIn" onClick={this.updateSignInClicked}>SIGN IN</button>
                <div className="want">Rent, Manage, Invest</div>
              </header>
            {signInScreen}
            </div>
        );
    }
}

export default Home;
