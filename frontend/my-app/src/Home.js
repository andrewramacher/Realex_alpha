import React from 'react';
import axios from 'axios';
import forge from 'node-forge'
import './Home.css';
import Browse from './dashboardComponents/Browse';
import About from './About';
import SignIn from './SignIn';
import CreateAccount from './CreateAccount';
import PopUp from './PopUp';
import p_logo from './images/Elegant.png';
import ClipLoader from "react-spinners/ClipLoader";
import {
    Redirect
} from "react-router-dom";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
          loggedInStatus: "NOT_LOGGED_IN",
          username: "",
          hasChecked: false,
          hasGot: false,
          clicked: "BROWSE",
          messages: [],
          chatUser: "Admin",
          properties: [],
          user: [],
          showAccountScreen: false,
          signInCLicked: false,
          createAccountClicked: false,
          incorrect: false,
          okText: "",
          showOk: false
        };
    
        this.checkLoginStatus = this.checkLoginStatus.bind(this);
        this.browse = this.browse.bind(this); //handles browse button click
        this.aboutClicked = this.aboutClicked.bind(this);
        this.makeStruct = this.makeStruct.bind(this);
        this.getProperties = this.getProperties.bind(this);
        this.getPageData = this.getPageData.bind(this);
        this.updateSignInClicked = this.updateSignInClicked.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.onCreateAccount = this.onCreateAccount.bind(this);
        this.cancel = this.cancel.bind(this);
        this.okClicked = this.okClicked.bind(this);
    }

    checkLoginStatus() {
        axios.get("https://www.realexinvest.com:8443/login", { withCredentials: true })
        .then(response => {
            if (this._isMounted && response.data.logged_in) {
                let data = JSON.stringify({
                    user: response.data.username
                });
                axios.post("https://www.realexinvest.com:8443/getUser", data,  {
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    withCredentials: true
                }).then(innerResponse => { //get rest of user data
                    this.setState({
                        loggedInStatus: "LOGGED_IN",
                        username: response.data.username,
                        user: innerResponse.data.user,
                        hasChecked: true
                    });
                }).catch(error => {
                    console.log("check login error", error);
                });
            } else if (this._isMounted && !response.data.logged_in) {
                this.getPageData(response.data.username);
                this.setState({
                    loggedInStatus: "NOT_LOGGED_IN",
                    username: "",
                    user: [],
                    hasChecked: true
                });
            }           
        })
        .catch(error => {
            console.log("check login error", error);
            this.setState({
                loggedInStatus: "NOT_LOGGED_IN",
                username: "",
                user: [],
                hasChecked: true
            });
        });

        //for debugging
        // this.setState({
        //     loggedInStatus: "LOGGED_IN",
        //     username: "Drew",
        //     user: [],
        //     hasChecked: true
        // });
    }

    makeStruct(names) {
        var names = names.split(' ');
        var count = names.length;
        function constructor() {
          for (var i = 0; i < count; i++) {
            this[names[i]] = arguments[i];
          }
        }
        return constructor;
    }

    getProperties(username) {
        var Property = this.makeStruct("id picture owner address price rent cap published");
        let data = JSON.stringify({
            username: username
        });
        axios.post("https://www.realexinvest.com:8443/getProperties", data, {
            headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true
        }).then(response => {
            var propertiesList = response.data.properties.map((property) => {
                var base64Flag = 'data:image/png;base64,';
                return new Property(property._id, 
                    base64Flag + property.pictureSmall,
                    property.owner, 
                    property.address, 
                    property.price, property.rent, 
                    property.cap, 
                    property.published
                )
            });
            this.setState({properties: propertiesList});
        })
        .catch(error => {
            console.log("check login error", error);
        });
    }

    getPageData(username) {
        this.getProperties(username);
        // window.setInterval(
        //     this.newMessages() //not written yet but will check if you messages need to be fetched
        // , 5000);
        this.setState({hasGot: true});
    }
    

    browse() {
        this.setState({
            clicked: "BROWSE"
        });
    }

    aboutClicked() {
        this.setState({
            clicked: "ABOUT"
        });
    }

    updateSignInClicked() {
      let newval = true;
      if(this.state.signInCLicked) {
        newval = false;
      }
      this.setState({signInCLicked: newval, createAccountClicked: false, showAbout: false});
    }

    onSubmit(username, password) {
      var password_enc = forge.md.sha384.create();
      password_enc.update(password);
      let data = JSON.stringify({
        type: "signIn",
        username: username,
        password: password_enc.digest().toHex()
      });
      axios.post('https://www.realexinvest.com:8443/login', data, {
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
        axios.post('https://www.realexinvest.com:8443/createAccount', data, {
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

    componentDidMount() {
        this._isMounted = true;
        this.interval = setInterval(() => this.checkLoginStatus(), 30000);
        this.checkLoginStatus();
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(this.interval);
    }



    render() {

        //Wait on credentials check
        if(this.state.loggedInStatus === "LOGGED_IN" && this.state.hasChecked) {
          return <Redirect push to='/dashboard'/>;
        } else if(!this.state.hasChecked) {
            return (
                <ClipLoader
                        loading={true}
                        color="#010101"
                        css="
                            position absolute; 
                            top: 50%;
                            left: 50%;
                            transform: translate(50%, 50%);
                        "
                />
            );
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
            showAbout={this.aboutClicked}
          />;
        }

        //Handle displaying create account screen
        let createAccountScreen;
        if(this.state.createAccountClicked) {
          createAccountScreen = <CreateAccount onSubmit={this.createAccount} onCancel={this.cancel}/>;
        }

        //Handle Component and Main Three Buttons
        let shown;
        let browseButton = <button className="browse" onClick={this.browse}>Browse</button>;
        let aboutButton = <button className="aboutHome" onClick={this.aboutClicked}>About</button>;
        if(this.state.clicked == "BROWSE") {
            shown = <Browse properties={this.state.properties} saveProperty={this.saveProperty}/>;
            browseButton = <button className="browseClicked">Browse</button>;
        } else if(this.state.clicked == "ABOUT") {
            shown = <About/>
            aboutButton = <button className="aboutClicked">About</button>;
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
          <div className="Dashboard">
            <div className="topBar">
                <img className="dashboardPlant" height={72} width={108} src={p_logo} alt="P_logo"/>
                <div className="dashboardRealExpress">Real Express</div>
            </div>
            <div className="middleBar">
                {browseButton}
                {aboutButton}
            </div>
            <button className="accountButton" onClick={this.updateSignInClicked}>SIGN IN</button>
            {shown}
            {signInScreen}
            {createAccountScreen}
            {okPopUp}
          </div>
        );
    }
}

export default Home;