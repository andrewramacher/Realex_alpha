import React from 'react';
import axios from 'axios';
import './SignIn.css';

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          username:  "",
          password: ""
        };
    
        this.submit = this.submit.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.showAbout = this.showAbout.bind(this);
    }

    submit() {
      this.props.onSubmit(this.state.username, this.state.password);
    }

    createAccount() {
      this.props.createAccount();
    }

    handleChangeUsername(event) {
      this.setState({username: event.target.value});
    }

    handleChangePassword(event) {
      this.setState({password: event.target.value});
    }

    showAbout() {
      this.props.showAbout();
    }


    render() {
        return (
          <div className="SignIn">
            <div className="userText">Username</div>
            <input className="signInInput" type="text" value={this.state.username} onChange={this.handleChangeUsername} />
            <div className="passText">Password</div>
            <input className="signInInput" type="password" value={this.state.password} onChange={this.handleChangePassword} />
            <button className="submitSignIn" onClick={this.submit}>Submit</button>
            <button className="createAccount" onClick={this.createAccount}>Create Account</button>
            <button className="createAccount" onClick={this.showAbout}>Forgot Password?</button>
            <div className="incorrectText">{this.props.incorrect}</div>
          </div>
        );
    }
}

export default SignIn;