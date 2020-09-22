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

    onViewClicked(e) {
        e.stopPropagation();
        this.props.onView(this.props.property);
    }

    onOtherClicked(e) { 
        e.stopPropagation();
        this.props.onButtonClicked(this.props.property);
    }

    onDeleteClicked(e) {
        e.stopPropagation();
        this.props.deleteFunction(e);
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
            owner =  <div className='textFieldOwner'>
                <div>Published:</div>
                <div>{published}</div>
            </div>;
        } else {
            owner =  <div className='textFieldOwner'>
                <div>Owner:</div>
                <div>{this.state.property.owner}</div>
            </div>;
        }

        //handle delete button
        let deleteButton;
        if(this.props.deleteButton) {
            deleteButton = <button className="deletePropertyButton" onClick={(e) => {this.onDeleteClicked(e)}}>x</button>
        }

        //handle buttons showing if not signed in
        let buttons;
        if(this.state.username) {
            buttons = <div className='buttons'>
                <button className='view' onClick={this.onViewClicked}>View</button>
                <button className='other' onClick={(e) => {this.onOtherClicked(e, this.state.property)}}>{this.state.buttonText}</button>
            </div>
        }

        return(
            <div className='propertyListItem' onClick={(e) => this.onViewClicked(e)}>
                <img className='picture' src={this.state.property.picture}/>
                <div className="fields">
                    <div className='textFieldPrice'>
                        <div>Price:</div>
                        <div>{this.state.property.price}</div>
                    </div>
                    <div className='textFieldAddress'>
                        <div>Address:</div>
                        <div>{this.state.property.address}</div>
                    </div>
                    <div className='textFieldRent'>
                        <div>Rent:</div>
                        <div>{this.state.property.rent}</div>
                    </div>
                   {owner}
                   {buttons}
                </div>
                {deleteButton}
            </div>
        );
    }
}

export default PropertyListItem;