import React from 'react';
import axios from 'axios';
import './App.css';
import SignIn from './SignIn';
import mh_logo from './images/moneyhouse_transparent.png'
import p_logo from './images/Elegant.png'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width:  432,
      height: 288,
      signInCLicked: false
    };

    this.sendIt = this.sendIt.bind(this);
    this.learnMore = this.learnMore.bind(this);
    this.updateSignInClicked = this.updateSignInClicked.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  sendIt(event) {
    axios.get('http://127.0.0.1:8080/', {
      params: {
      }
    }).then(res=>console.log(res))
    .catch(err=>console.log(err))
  }

  learnMore(event) {
    
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

  /**
   * Add event listener for window resize
   */
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  /**
   * Remove event listener for window resize
   */
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  render() {

    //Handle displaying sign in screen
    let signInScreen;
    if(this.state.signInCLicked) {
      signInScreen = <SignIn onSubmit={this.updateSignInClicked}/>;
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

export default App;
