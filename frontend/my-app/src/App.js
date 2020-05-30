import React from 'react';
import axios from 'axios';
import './App.css';
import mh_logo from './images/moneyhouse_transparent.png'
import p_logo from './images/Plant_logo_centered.png'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width:  500,
      height: 500
    };

    this.sendIt = this.sendIt.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  sendIt(event) {
    axios.get('http://127.0.0.1:8080/')
    .then(res=>console.log(res))
    .catch(err=>console.log(err))
  }

  updateDimensions() {
    if(window.innerWidth < 500) {
      this.setState({ width: 250, height: 250 });
    } else {
      let update_width  = Math.floor((500 * window.innerWidth) / 1000);
      let update_height = Math.floor((500 * window.innerWidth) / 1000);
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
    return (
      <div className="App">
        <header className="App-header">
          <button className="small"><img className="small" src={mh_logo} alt="my image" onClick={this.sendIt} /></button>
          <img height={this.state.height} width={this.state.width} src={p_logo} alt="P_logo"/>
          <button className="signIn">Sign In</button>
          <button onClick={this.sendIt}>Click Say Hello World</button>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </header>
      </div>
    );
  }

}

export default App;
