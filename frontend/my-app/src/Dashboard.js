import React from 'react';
import axios from 'axios';
import './Dashboard.css';
import Browse from './dashboardComponents/Browse';
import Chat from './dashboardComponents/Chat';
import About from './About';
import Properties from './dashboardComponents/Properties';
import p_logo from './images/Elegant.png';
import ClipLoader from "react-spinners/ClipLoader";
import {
    Redirect
} from "react-router-dom";

class Dashboard extends React.Component {
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
          chatUser: "",
          properties: [],
          user: [],
          showAccountScreen: false
        };
    
        this.checkLoginStatus = this.checkLoginStatus.bind(this);
        this.signOut = this.signOut.bind(this);
        this.browse = this.browse.bind(this); //handles browse button click
        this.chatClicked = this.chatClicked.bind(this);
        this.openChat = this.openChat.bind(this);
        this.properties = this.properties.bind(this); //handles properties button click
        this.aboutClicked = this.aboutClicked.bind(this);
        this.makeStruct = this.makeStruct.bind(this);
        this.getProperties = this.getProperties.bind(this);
        this.saveProperty = this.saveProperty.bind(this);
        this.getMessages = this.getMessages.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.getPageData = this.getPageData.bind(this);
        this.unsaveProperty = this.unsaveProperty.bind(this);
        this.publishProperty = this.publishProperty.bind(this);
        this.unpublishProperty = this.unpublishProperty.bind(this);
        this.onShowAccountScreen = this.onShowAccountScreen.bind(this);
    }

    checkLoginStatus() {
        axios.get("http://127.0.0.1:8080/login", { withCredentials: true })
        .then(response => {
            if (this._isMounted && response.data.logged_in) {
                let data = JSON.stringify({
                    user: response.data.username
                });
                axios.post("http://127.0.0.1:8080/getUser", data,  {
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    withCredentials: true
                }).then(innerResponse => { //get rest of user data
                    this.getPageData(response.data.username);
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
        axios.post("http://127.0.0.1:8080/getProperties", data, {
            headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true
        }).then(response => {
            var propertiesList = response.data.properties.map((property) => {
                var base64Flag = 'data:image/png;base64,';
                return new Property(property._id, 
                    base64Flag + property.picture,
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

    getMessages(username) {
        var Message = this.makeStruct("id sender receiver text date");
        let data = JSON.stringify({
            username: username
        });
        axios.post("http://127.0.0.1:8080/messages", data, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
        }).then(response => {
            var messagesList = response.data.messages.map((message) => {
                return new Message(
                    message._id, 
                    message.sender,
                    message.receiver, 
                    message.text, 
                    message.date,
                )
            });
            this.setState({messages: messagesList});
        })
        .catch(error => {
            console.log("check login error", error);
        });
    }

    sendMessage(receiver, text) {
        //Move this to dashboard so new messages show up if you leave chat menu

        //add message to database
        //id sender receiver text date
        if(receiver === "") {
            return;
        }
        var date = Date.now();
        let message = {
            sender: this.state.username,
            receiver: receiver,
            text: text,
            date: date
        };
        axios.post('http://127.0.0.1:8080/sendMessage', JSON.stringify(message), {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        }).then(response => {
            //Check if successful
            if(response.data.success) {
                //add message to messages
                this.setState((prevState) => ({messages: [...prevState.messages, message]}));
            } else {
                //do something!!
                //add message to messages
                this.setState((prevState) => ({messages: [...prevState.messages, message]}));
            }
        })
        
        
    }

    getPageData(username) {
        this.getProperties(username);
        this.getMessages(username);
        // window.setInterval(
        //     this.newMessages() //not written yet but will check if you messages need to be fetched
        // , 5000);
        this.setState({hasGot: true});
    }

    saveProperty(property) {
        if(this.state.user.saved.includes(property.id)) {
            //alert("Property has already been saved");
            return;
        } else if (this.state.username === property.owner) {
            return;
        }
        let data = JSON.stringify({
            id: property.id,
            username: this.state.username
        });
        
        axios.post('http://127.0.0.1:8080/save', data, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
        }).then(response => {
        }).catch(error => {
            console.log("check login error", error);
        });
        var newUser = this.state.user;
        newUser.saved.push(property.id);
        this.setState({user: newUser});
    }

    unsaveProperty(id) {
        var newUser = this.state.user;
        for(var i = 0; i < newUser.saved.length; i++) {
            if(newUser.saved[i] == id) {
                newUser.saved.splice(i,1);
            }
        }
        this.setState({user: newUser});
    }

    publishProperty(id) {
        var newUser = this.state.user;
        newUser.numPublished += 1;
        var newProperties = this.state.properties;
        for(var i = 0; i < newProperties.length; i++) {
            if(newProperties[i].id == id) {
                newProperties[i].published = true;
            }
        }
        this.setState({user: newUser, properties: newProperties});
    }

    unpublishProperty(id) {
        var newUser = this.state.user;
        newUser.numPublished -= 1;
        var newProperties = this.state.properties;
        for(var i = 0; i < newProperties.length; i++) {
            if(newProperties[i].id == id) {
                newProperties[i].published = false;
            }
        }
        this.setState({user: newUser, properties: newProperties});
    }

    openChat(owner) {
        //open chat from properties
        this.setState({
            clicked: "CHAT",
            chatUser: owner
        })
    }

    browse() {
        this.setState({
            clicked: "BROWSE"
        });
    }

    chatClicked() {
        this.setState({
            clicked: "CHAT"
        });
    }

    properties() {
        this.setState({
            clicked: "PROPERTIES"
        });
    }

    aboutClicked() {
        this.setState({
            clicked: "ABOUT"
        });
    }

    signOut() {
        let data = JSON.stringify({
            type: "signOut",
            username: "",
            password: ""
        });
        axios.post('http://127.0.0.1:8080/login', data, {
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

    onShowAccountScreen() {
        var newVal = !this.state.showAccountScreen;
        this.setState({showAccountScreen: newVal});
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
        if(this.state.loggedInStatus === "NOT_LOGGED_IN" && this.state.hasChecked) {
            return <Redirect push to='/'/>;
        } else if (this.state.loggedInStatus === "NOT_LOGGED_IN") {
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

        //Handle Account
        let accountScreen;
        if(this.state.showAccountScreen) {
            accountScreen = <div className="accountScreen">
                <div className="canPublishText">Has Published: </div>
                <div className="canPublish">{this.state.user.numPublished}</div>
                <button className="signOut" onClick={this.signOut}>Sign Out</button>
            </div>
        }

        //Handle Component and Main Three Buttons
        let shown;
        let browseButton = <button className="browse" onClick={this.browse}>Browse</button>;
        let chatButton = <button className="chat" onClick={this.chatClicked}>Chat</button>;
        let propertiesButton = <button className="properties" onClick={this.properties}>Properties</button>;
        let aboutButton = <button className="about" onClick={this.aboutClicked}>About</button>;
        if(this.state.clicked == "BROWSE") {
            shown = <Browse properties={this.state.properties} saveProperty={this.saveProperty}/>;
            browseButton = <button className="browseClicked">Browse</button>;
        } else if(this.state.clicked == "CHAT") {
            shown = <Chat 
                messages={this.state.messages} 
                username={this.state.username} 
                chatUser={this.state.chatUser} 
                sendMessage={this.sendMessage}
            />;
            chatButton = <button className="chatClicked">Chat</button>;
        } else if(this.state.clicked == "PROPERTIES") {
            shown = <Properties 
                properties={this.state.properties} 
                username ={this.state.username} 
                user={this.state.user} 
                unsaveProperty={this.unsaveProperty}
                publishProperty={this.publishProperty}
                unpublishProperty={this.unpublishProperty}
                addLocalProperty={this.addLocalProperty}
                chat={this.openChat}
            />;
            propertiesButton = <button className="propertiesClicked">Properties</button>;
        } else if(this.state.clicked == "ABOUT") {
            shown = <About/>
            aboutButton = <button className="aboutClicked">About</button>;
        }


        return (
          <div className="Dashboard">
            <div className="topBar">
                <img className="dashboardPlant" height={72} width={108} src={p_logo} alt="P_logo"/>
                <div className="dashboardRealExpress">Real Express</div>
            </div>
            <div className="middleBar">
                {browseButton}
                {chatButton}
                {propertiesButton}
                {aboutButton}
            </div>
            <button className="accountButton" onClick={this.onShowAccountScreen}>{this.state.username}</button>
            {shown}
            {accountScreen}
          </div>
        );
    }
}

export default Dashboard;