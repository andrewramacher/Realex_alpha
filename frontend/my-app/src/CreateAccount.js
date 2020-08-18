import React from 'react';
import axios from 'axios';
import './CreateAccount.css';

class CreateAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          username:  "",
          email: "",
          password: "",
          confirm: ""
        };
    
        this.createAccount = this.createAccount.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeConfirm = this.handleChangeConfirm.bind(this);
    }

    createAccount() {
        if(this.state.username === "" || this.state.password === "" || this.state.confirm === "" || this.state.email === "") {
            alert("No Empty Fields Allowed");
            return;
        } else if(this.state.username.length > 10) {
            alert("Username cannot be more than 10 characters");
            return;
        } else if(!(this.state.password === this.state.confirm)) {
            alert("Passwords Must Match");
            return;
        } else if(!this.state.email.includes("@")) {
            alert("Please enter valid email");
            return;
        }
        this.props.onSubmit(this.state.username, this.state.email, this.state.password);
    }

    cancel() {
        this.props.onCancel();
    }

    handleChangeUsername(event) {
      this.setState({username: event.target.value});
    }

    handleChangeEmail(event) {
        this.setState({email: event.target.value});
      }

    handleChangePassword(event) {
      this.setState({password: event.target.value});
    }

    handleChangeConfirm(event) {
        this.setState({confirm: event.target.value});
    }


    render() {
        return (
          <div className="CreateAccount">
            <div className="userText">Username</div>
            <input type="text" value={this.state.username} onChange={this.handleChangeUsername} />
            <div className="passText">Password</div>
            <input type="password" value={this.state.password} onChange={this.handleChangePassword} />
            <div className="confirmText"> Confirm Password</div>
            <input type="password" value={this.state.confirm} onChange={this.handleChangeConfirm} />
            <div className="emailText">Email</div>
            <input type="text" value={this.state.email} onChange={this.handleChangeEmail} />
            <button className="submit" onClick={this.createAccount}>Create</button>
            <button className="cancel" onClick={this.cancel}>Cancel</button>
          </div>
        );
    }
}

export default CreateAccount;