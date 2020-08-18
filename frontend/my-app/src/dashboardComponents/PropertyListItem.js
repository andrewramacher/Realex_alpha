import React from 'react';
import './PropertyListItem.css';

class PropertyListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: this.props.buttonText,
            fields: this.props.fields,
            username: this.props.username,
            property: this.props.property
        };
    
        this.onViewClicked = this.onViewClicked.bind(this);
        this.onOtherClicked = this.onOtherClicked.bind(this);
        this.onDeleteClicked = this.onDeleteClicked.bind(this);
        //id picture address price rent cap documents
    }

    onViewClicked() {
        this.props.onView(this.props.property);
    }

    onOtherClicked() {
        this.props.onButtonClicked(this.props.property);
    }

    onDeleteClicked() {
        this.props.deleteFunction();
    }
    
    
    render() {
        //handle if owned
        let owner;
        if(this.state.username === this.state.property.owner) {
            let published;
            if(this.state.property.published) {
                published = "Yes";
            } else {
                published = "No";
            }
            owner =  <div className='textField'>
                <div>Published:</div>
                <div>{published}</div>
            </div>;
        } else {
            owner =  <div className='textField'>
                <div>Owner:</div>
                <div>{this.state.property.owner}</div>
            </div>;
        }

        //handle delete button
        let deleteButton;
        if(this.props.deleteButton) {
            deleteButton = <button className="deletePropertyButton" onClick={() => {this.onDeleteClicked()}}>x</button>
        }
        return(
            <div className='propertyListItem'>
                <img className='picture' src={this.state.property.picture}/>
                <div className="fields">
                    <div className='textField'>
                        <div>Address:</div>
                        <div>{this.state.property.address}</div>
                    </div>
                    <div className='textField'>
                        <div>Price:</div>
                        <div>{this.state.property.price}</div>
                    </div>
                    <div className='textField'>
                        <div>Rent:</div>
                        <div>{this.state.property.rent}</div>
                    </div>
                   {owner}
                </div>
                <div className='buttons'>
                    <button className='view' onClick={this.onViewClicked}>View</button>
                    <button className='other' onClick={() => {this.onOtherClicked(this.state.property)}}>{this.state.buttonText}</button>
                </div>
                {deleteButton}
            </div>
        );
    }
}

export default PropertyListItem;