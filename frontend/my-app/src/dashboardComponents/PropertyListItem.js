import React from 'react';
import './PropertyListItem.css';

class PropertyListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: this.props.buttonText
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
        let deleteButton;
        if(this.props.deleteButton) {
            deleteButton = <button className="deletePropertyButton" onClick={() => {this.onDeleteClicked()}}>x</button>
        }
        return(
            <div className='propertyListItem'>
                <img className='picture' src={this.props.property.picture}/>
                <div className='address'>
                    <div>Address:</div>
                    <div>{this.props.property.address}</div>
                </div>
                <div className='price'>
                    <div>Price:</div>
                    <div>{this.props.property.price}</div>
                </div>
                <div className='rent'>
                    <div>Rent:</div>
                    <div>{this.props.property.rent}</div>
                </div>
                <div className='owner'>
                    <div>Owner:</div>
                    <div>{this.props.property.owner}</div>
                </div>
                <div className='buttons'>
                    <button className='view' onClick={this.onViewClicked}>View</button>
                    <button className='other' onClick={() => {this.onOtherClicked(this.props.property)}}>{this.state.buttonText}</button>
                </div>
                {deleteButton}
            </div>
        );
    }
}

export default PropertyListItem;