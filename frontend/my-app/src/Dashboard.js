import React from 'react';
import axios from 'axios';
import './Dashboard.css';
import Browse from './dashboardComponents/Browse';
import Chat from './dashboardComponents/Chat';
import Properties from './dashboardComponents/Properties';
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
          clicked: "BROWSE",
          properties: [],
          user: [],
          rerenders: 0
        };
    
        this.checkLoginStatus = this.checkLoginStatus.bind(this);
        this.signOut = this.signOut.bind(this);
        this.browse = this.browse.bind(this);
        this.chat = this.chat.bind(this);
        this.properties = this.properties.bind(this);
        this.makeStruct = this.makeStruct.bind(this);
        this.getProperties = this.getProperties.bind(this);
        this.saveProperty = this.saveProperty.bind(this);
        this.unsaveProperty = this.unsaveProperty.bind(this);
        this.publishProperty = this.publishProperty.bind(this);
        this.unpublishProperty = this.unpublishProperty.bind(this);
        this.updateUser = this.updateUser.bind(this);
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
        });
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

    getProperties() {
        var Property = this.makeStruct("id picture owner address price rent cap published");
        axios.get("http://127.0.0.1:8080/properties", { withCredentials: true })
        .then(response => {
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

    //might not be used
    updateUser(username) {
        let data = JSON.stringify({
            user: username
        });
        axios.post("http://127.0.0.1:8080/getUser", data,  {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
        }).then(response => {
            this.setState({
                user: response.data.user
            });
        })
        .catch(error => {
            console.log("check login error", error);
        });
    }

    saveProperty(property) {
        if(this.state.user.saved.includes(property.id)) {
            //alert("Property has already been saved");
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

    browse() {
        this.setState({
            clicked: "BROWSE"
        });
    }

    chat() {
        this.setState({
            clicked: "CHAT"
        });
    }

    properties() {
        this.setState({
            clicked: "PROPERTIES"
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



    componentDidMount() {
        this._isMounted = true;
        this.checkLoginStatus();
        this.getProperties();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }



    render() {
        //Wait on credentials check
        /*if(this.state.loggedInStatus === "NOT_LOGGED_IN" && this.state.hasChecked) {
            return <Redirect push to='/'/>;
        } else*/ if (this.state.loggedInStatus === "NOT_LOGGED_IN") {
            return (
                <div>Checking Credentials</div>
            );
        }

        //check which component and button to display
        let shown;
        let browseButton = <button className="browse" onClick={this.browse}>Browse</button>;
        let chatButton = <button className="chat" onClick={this.chat}>Chat</button>;
        let propertiesButton = <button className="properties" onClick={this.properties}>Properties</button>;
        if(this.state.clicked == "BROWSE") {
            shown = <Browse properties={this.state.properties} saveProperty={this.saveProperty}/>;
            browseButton = <button className="browseClicked">Browse</button>;
        } else if(this.state.clicked == "CHAT") {
            shown = <Chat/>;
            chatButton = <button className="chatClicked">Chat</button>;
        } else if(this.state.clicked == "PROPERTIES") {
            shown = <Properties 
                properties={this.state.properties} 
                username ={this.state.username} 
                user={this.state.user} 
                unsaveProperty={this.unsaveProperty}
                publishProperty={this.publishProperty}
                unpublishProperty={this.unpublishProperty}
            />;
            propertiesButton = <button className="propertiesClicked">Properties</button>;
        }


        return (
          <div className="Dashboard">
            {browseButton}
            {chatButton}
            {propertiesButton}
            <button className="signOut" onClick={this.signOut}>Sign Out</button>
            {shown}
          </div>
        );
    }
}

export default Dashboard;