import React from 'react';
import './ViewProperty.css';
import axios from 'axios';

class ViewProperty extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            property: this.props.property,
            docNum: 0,
            docNumMax: this.props.property.documents.length
        };
    
        this.incDoc = this.incDoc.bind(this);
        this.decDoc = this.decDoc.bind(this);
    }

    incDoc() {
        this.setState((prevState) => ({docNum:prevState.docNum + 1}))
    }

    decDoc() {
        this.setState((prevState) => ({docNum:prevState.docNum - 1}))
    }

    render() {
        //sets up documents
        let documents;
        if(this.state.property.documents) { 
            documents= this.state.property.documents.map( (document, index) =>
                <img key={index} className="viewPicture" src={document}/>
            );
        }

        //handles which image is shown
        let picture;
        if(this.state.docNum === 0) {
            picture = <img className="viewPicture" src={this.state.property.picture}/>
        } else {
            picture = documents[this.state.docNum - 1];
        }

        //handles which arrows are shown
        let leftArrow;
        let rightArrow;
        if(this.state.docNum > 0) {
            leftArrow = <button className="leftArrow" onClick={this.decDoc}>{String.fromCharCode(60)}</button>
        }
        if(this.state.docNum < this.state.docNumMax) {
            rightArrow = <button className="rightArrow" onClick={this.incDoc}>></button>
        }
        return(
            <div className="propertyView">
                    <button className="closeView" onClick={this.props.closeView}>x</button>
                    <div className="viewPropertyScrollable">
                        {leftArrow}
                        {picture}
                        {rightArrow}
                        <div className="viewAddress">
                            <div className="viewAddressData">{this.state.property.address}</div>
                        </div>
                        <div className="viewDescriptionPair">
                            <div className="viewTextData">{this.state.property.description}</div>
                        </div>
                        <div className="viewPropertyAttributes">
                            <div className="viewPair">
                                <div className="viewText">Price: </div>
                                <div className="viewTextData">{this.state.property.price}</div>
                            </div>
                            <div className="viewPair">
                                <div className="viewText">Rent: </div>
                                <div className="viewTextData">{this.state.property.rent}</div>
                            </div>
                            <div className="viewPair">
                                <div className="viewText">bedrooms: </div>
                                <div className="viewTextData">{this.state.property.bedrooms}</div>
                            </div>
                            <div className="viewPair">
                                <div className="viewText">Bathrooms: </div>
                                <div className="viewTextData">{this.state.property.bathrooms}</div>
                            </div>
                            <div className="viewPair">
                                <div className="viewText">Square Footage: </div>
                                <div className="viewTextData">{this.state.property.squareFootage}</div>
                            </div>
                            <div className="viewPair">
                                <div className="viewText">Year Built: </div>
                                <div className="viewTextData">{this.state.property.yearBuilt}</div>
                            </div>
                            <div className="viewPair">
                                <div className="viewText">Heating: </div>
                                <div className="viewTextData">{this.state.property.heating}</div>
                            </div>
                            <div className="viewPair">
                                <div className="viewText">Cooling: </div>
                                <div className="viewTextData">{this.state.property.cooling}</div>
                            </div>
                            <div className="hiddenBottomAttributes"></div>
                        </div>
                    </div>
            </div>
        );
    }
}

export default ViewProperty;