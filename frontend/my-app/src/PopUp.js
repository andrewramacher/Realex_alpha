import React from 'react';
import './PopUp.css';

class PopUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    
        //this.addClicked = this.addClicked.bind(this);
    }


    render() {
        let buttons;
        if(this.props.type === "ok") {
            buttons = <button className="okPopUpButton" onClick={() => {this.props.okFunction()}}>Ok</button>
        } else if(this.props.type === "yesno") {
            buttons = 
            <div className="popUpButtons">
                <button className="yesPopUpButton" onClick={() => {this.props.yesFunction()}}>Yes</button>
                <button className="noPopUpButton" onClick={() => {this.props.noFunction()}}>No</button>
            </div>
        }
        return(
            <div className="popUp">
                <div className="popUptext">{this.props.text}</div>
                {buttons}
            </div>
        );
    }
}

export default PopUp;