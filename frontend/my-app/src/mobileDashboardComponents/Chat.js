import React from 'react';
import './Chat.css';
import PopUp from '.././PopUp';
import axios from 'axios';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
          messages: this.props.messages,
          text: "",
          receiver: this.props.chatUser,
          bothReadyPopUp: true,
          readyPopUp: false,
          unreadyPopUp: false
        };

        this.messagesEnd = React.createRef();
    
        this.handleChangeText = this.handleChangeText.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.sendClicked = this.sendClicked.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.setReceiver = this.setReceiver.bind(this);
        this.onSidebarClicked = this.onSidebarClicked.bind(this);
        this.closePopUpClicked = this.closePopUpClicked.bind(this);
        this.readyClicked = this.readyClicked.bind(this);
        this.unreadyClicked = this.unreadyClicked.bind(this);
        this.sendReady = this.sendReady.bind(this);
        this.sendUnready = this.sendUnready.bind(this);
    }
   
    handleChangeText(event) {
        this.setState({text: event.target.value});
    }

    //Event handling done with time based await, not good
    sendClicked() {
        this.sendMessage()
        this.scrollToBottom(1)
    }
    
    sendMessage() {
        //Move this to dashboard so new messages show up if you leave chat menu
        this.props.sendMessage(this.state.receiver, this.state.text);
        var date = Date.now();
        let message = {
            sender: this.props.username,
            receiver: this.state.receiver,
            text: this.state.text,
            date: date
        }; 
        this.setState((prevState) => ({messages: [...prevState.messages, message], text: ""}));
    }

    async scrollToBottom(time) {
        await new Promise(r => setTimeout(r, time));
        this.messagesEnd.current.scrollIntoView();//{ behavior: "smooth" }
    }

    setReceiver(user) {
        this.setState({receiver: user, text: ""});
    }

    onSidebarClicked(user) {
        this.setReceiver(user);
        this.scrollToBottom(1);
    }

    closePopUpClicked() {
        this.setState({bothReadyPopUp: false, readyPopUp: false, unreadyPopUp: false})
    }

    readyClicked(){
        this.setState({readyPopUp: true});
    }

    unreadyClicked(){
        this.setState({unreadyPopUp: true});
    }

    sendReady() {
        this.props.sendMessage(this.state.receiver, "READYTOBUY");
        var date = Date.now();
        let message = {
            sender: this.props.username,
            receiver: this.state.receiver,
            text: "READYTOBUY",
            date: date
        }; 
        this.setState((prevState) => ({messages: [...prevState.messages, message], readyPopUp: false}));
    }
   
    sendUnready() {
        this.props.sendMessage(this.state.receiver, "NOTREADYTOBUY");
        var date = Date.now();
        let message = {
            sender: this.props.username,
            receiver: this.state.receiver,
            text: "NOTREADYTOBUY",
            date: date
        }; 
        this.setState((prevState) => ({messages: [...prevState.messages, message], unreadyPopUp: false}));
    }

    render() {
        //get users
        var userList = [];
        this.state.messages.map((message) => {
            if (message.receiver !== this.props.username && !userList.includes(message.receiver))
                userList.push(message.receiver);
            else if (message.sender !== this.props.username && !userList.includes(message.sender))
                userList.push(message.sender);
        });
        //adds user if brought from chat button
        if(!userList.includes(this.props.chatUser) && !(this.props.chatUser === ""))
            userList.push(this.props.chatUser)
        //fill sidebars
        var sidebar = userList.map((user, index) => {
            if(user === this.state.receiver) {
                return <button className="sidebarUserClicked" key={index} onClick={() => this.onSidebarClicked(user)}>{user}</button>
            } else {
                return <button className="sidebarUser" key={index} onClick={() => this.onSidebarClicked(user)}>{user}</button>
            }
        });
        
        //sorts in ascending order by date the messages for this receiver
        let userChecked = false;
        let otherChecked = false;
        var messageList = this.state.messages
            .filter((message) => message.receiver === this.state.receiver || message.sender === this.state.receiver)
            .sort((a,b) => a.date > b.date ? 1 : -1)
            .map((message, index) => {
                if(message.sender === this.props.username) {
                    if(message.text === "READYTOBUY") userChecked = true;
                    else if(message.text === "NOTREADYTOBUY") userChecked = false;
                    else {
                        return <div className="sentMessage" key={index}>
                            {message.text}
                        </div>;
                    }
                }
                else {
                    if(message.text === "READYTOBUY") otherChecked = true;
                    else if(message.text === "NOTREADYTOBUY") otherChecked = false;
                    else {
                        return <div className="receivedMessage" key={index}>
                            {message.text}
                        </div>;
                    }
                }
            });

        //handles popup
        let popUp;
        if(userChecked && otherChecked && this.state.bothReadyPopUp) {
            popUp = <PopUp
                type="ok"
                text={"Both users are ready to transact. Please chat admin"}
                okFunction={this.closePopUpClicked}
            />
        } else if(this.state.readyPopUp) {
            popUp = <PopUp
                type="yesno"
                text="Are you sure you are ready to transact?"
                yesFunction={this.sendReady}
                noFunction={this.closePopUpClicked}
            />
        } else if(this.state.unreadyPopUp) {
            popUp = <PopUp
                type="yesno"
                text="Are you sure you are no longer ready to transact?"
                yesFunction={this.sendUnready}
                noFunction={this.closePopUpClicked}
            />
        }

        //handles ready/unready button
        let transactButton;
        if(userChecked && this.state.receiver !== "" && this.state.receiver !== "Admin") {
            transactButton = <button 
                className="transactButtonMobile" 
                onClick={this.unreadyClicked}>
                Not ready to transact
            </button>
        } else if(this.state.receiver !== "" && this.state.receiver !== "Admin") {
            transactButton = <button 
                className="transactButtonMobile" 
                onClick={this.readyClicked}>
                Ready to transact
            </button>
        }
        //handles text below
        let transactText;
        if(otherChecked && this.state.receiver !== "" && this.state.receiver !== "Admin") {
            transactText = <div className="transactTextMobile">
                Other person is ready to transact
            </div>
        } else if(this.state.receiver !== "" && this.state.receiver !== "Admin") {
            transactText = <div className="transactTextMobile" >
                Other person is not ready to transact
            </div>
        }
        

        //handles send button
        let sendButton;
        if(this.state.text !== "" && this.state.receiver !== "") {
            sendButton = <button className="sendButton" onClick={this.sendClicked}>Send</button>
        }

        return(
            <div>
                <div className="sidebar">
                    {sidebar}
                </div>
                <div className="messages">
                    {messageList}
                    <div className="messagesEnd" ref={this.messagesEnd}></div>
                </div>
                <div className="chatBottomArea">
                    <textarea className="textBox" type="text" rows={1} cols={5} value={this.state.text} onChange={this.handleChangeText}/>
                    {sendButton}
                </div>
                {popUp}
                {transactButton}
                {transactText}
            </div>
        );
    }
}

export default Chat;