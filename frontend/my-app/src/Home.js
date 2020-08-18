import React from 'react';
import axios from 'axios';
import forge from 'node-forge'
import './Home.css';
import SignIn from './SignIn';
import PopUp from './PopUp';
import About from './About';
import CreateAccount from './CreateAccount';
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
          createAccountClicked: false,
          loggedInStatus: "NOT_LOGGED_IN",
          user: "",
          okText: "",
          showOk: false,
          showAbout: false
        };
    
        this.updateSignInClicked = this.updateSignInClicked.bind(this);
        this.checkLoginStatus = this.checkLoginStatus.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onCreateAccount = this.onCreateAccount.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.cancel = this.cancel.bind(this);
        this.okClicked = this.okClicked.bind(this);
        this.showAbout = this.showAbout.bind(this);
    }

    updateSignInClicked() {
        let newval = true;
        if(this.state.signInCLicked) {
          newval = false;
        }
        this.setState({signInCLicked: newval, createAccountClicked: false, showAbout: false});
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

    checkLoginStatus(tried) {
        axios.get("http://127.0.0.1:8080/login", { withCredentials: true })
        .then(response => {
            if (
              response.data.logged_in &&
              this.state.loggedInStatus === "NOT_LOGGED_IN"
            ) {
              this.setState({
                loggedInStatus: "LOGGED_IN",
                user: response.data.user
              });
            } else if(tried){
              this.setState({
                loggedInStatus: "NOT_LOGGED_IN",
                user: "",
                incorrect: true
              });
            }
            //console.log(this.state.loggedInStatus);
        })
        .catch(error => {
            console.log("check login error", error);
        });
    }

    onSubmit(username, password) {
        var password_enc = forge.md.sha384.create();
        password_enc.update(password);
        console.log(password_enc.digest().toHex());
        let data = JSON.stringify({
          type: "signIn",
          username: username,
          password: password_enc.digest().toHex()
        });
        axios.post('http://127.0.0.1:8080/login', data, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }).then(response => {
          //For debugging same session vs another session
          //console.log(response.data.count);
          this.checkLoginStatus(true);
          this.setState({incorrect: false});
        })
    }

    createAccount(username, email, password) {
        var password_enc = forge.md.sha384.create();
        password_enc.update(password);
        let data = JSON.stringify({
          username: username,
          email: email,
          password: password_enc.digest().toHex()
        });
        axios.post('http://127.0.0.1:8080/createAccount', data, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }).then(response => {
          //Check if successful
          if(response.data.success) {
            this.checkLoginStatus();
          } else if(response.data.taken) {
            this.setState({showOk: true, okText: "Username Already Taken"});
          }// else {
              //Something to handle server error
          // }
        })
    }

    onCreateAccount() {
        this.setState({createAccountClicked: true, signInCLicked: false});
    }

    cancel() {
      this.setState({createAccountClicked: false});
    }

    okClicked() {
      this.setState({showOk: false, okText: null});
    }

    showAbout() {
      this.setState((prevState) => ({showAbout: !prevState.showAbout, signInCLicked: false}));
    }

    componentDidMount() {
        this.updateDimensions();
        this.checkLoginStatus(false);
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }



    render() {

        if(this.state.loggedInStatus === "LOGGED_IN") {
            return <Redirect push to='/dashboard'/>;
        }

        //handle incorrect message
        let incorrect;
        if(this.state.incorrect === true) {
          incorrect = "Incorrect Username or Password";
        }

        //Handle displaying sign in screen
        let signInScreen;
        if(this.state.signInCLicked) {
            signInScreen = <SignIn 
            onSubmit={this.onSubmit} 
            createAccount={this.onCreateAccount} 
            incorrect={incorrect} 
            showAbout={this.showAbout}
          />;
        }

        //Handle displaying create account screen
        let createAccountScreen;
        if(this.state.createAccountClicked) {
          createAccountScreen = <CreateAccount onSubmit={this.createAccount} onCancel={this.cancel}/>;
        }

        //handle about
        let about;
        if(this.state.showAbout) {
          about = <About/>;
        }

        let okPopUp;
        if(this.state.showOk) {
          okPopUp = <PopUp 
            type="ok"
            text={this.state.okText}
            okFunction={this.okClicked}
          />
        }
        
        return (
            <div className="App">
              <div className="homeAbout">{about}</div>
              <header className="App-header">
                <button className="small"><img className="small" src={mh_logo} alt="my image" onClick={this.showAbout} /></button>
                <img className="plant" height={this.state.height} width={this.state.width} src={p_logo} alt="P_logo"/>
                <div className="name">REAL EXPRESS</div>
                <button className="signIn" onClick={this.updateSignInClicked}>SIGN IN</button>
                <div className="want">Buy Sell Rentals Fast</div>
              </header>
              {signInScreen}
              {createAccountScreen}
              {okPopUp}
            </div>
        );
    }
}

export default Home;