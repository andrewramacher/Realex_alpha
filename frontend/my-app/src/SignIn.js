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
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
    }

    submit() {
      this.props.onSubmit();
      // axios.get('http://127.0.0.1:8080/', {
      //   params: {
      //     type: "signIn",
      //     username: this.state.username,
      //     password: this.state.password
      //   }
      // }).then(res=>console.log(res))
      // .catch(err=>console.log(err))
      //this.setState({username: "", password: ""});
    }

    handleChangeUsername(event) {
      this.setState({username: event.target.value});
    }

    handleChangePassword(event) {
      this.setState({password: event.target.value});
    }


    render() {
        return (
          <div className="SignIn">
            <div className="userText">Username</div>
            <input type="text" value={this.state.username} onChange={this.handleChangeUsername} />
            <div className="passText">Password</div>
            <input type="text" value={this.state.password} onChange={this.handleChangePassword} />
            <button className="submit" onClick={this.submit}>Submit</button>
          </div>
        );
    }
}

export default SignIn;