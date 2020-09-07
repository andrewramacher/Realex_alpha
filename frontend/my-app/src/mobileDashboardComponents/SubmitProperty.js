import React from 'react';
import './SubmitProperty.css';
import DocumentInput from './DocumentInput';
import axios from 'axios';

class SubmitProperty extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            property: this.props.property,
            id: this.props.id,
            picture: null,
            description: "",
            address: "",
            price: "",
            bedrooms: "",
            bathrooms: "",
            squareFootage: "",
            yearBuilt: "",
            heating: "",
            cooling: "",
            rent: "",
            documents: [],
            numDocuments: 0
        };

        this.onPictureChange = this.onPictureChange.bind(this);
        this.addFields = this.addFields.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onAddressChange = this.onAddressChange.bind(this);
        this.onPriceChange = this.onPriceChange.bind(this);
        this.onBedroomsChange = this.onBedroomsChange.bind(this);
        this.onBathroomsChange = this.onBathroomsChange.bind(this);
        this.onSquareFootageChange = this.onSquareFootageChange.bind(this);
        this.onYearBuiltChange = this.onYearBuiltChange.bind(this);
        this.onHeatingChange = this.onHeatingChange.bind(this);
        this.onCoolingChange = this.onCoolingChange.bind(this);
        this.onRentChange = this.onRentChange.bind(this);
        this.onDocumentChange = this.onDocumentChange.bind(this);
        this.addDocument = this.addDocument.bind(this);
        this.removeDocument = this.removeDocument.bind(this);
        this.submitProperty = this.submitProperty.bind(this);
    }

    addFields() {
        var picture = null;// = (this.state.property.picture) ? this.state.property.picture : null ;
        var description = (this.state.property.description) ? this.state.property.description : "";
        var address = (this.state.property.address) ? this.state.property.address : "";
        var price = (this.state.property.price) ? this.state.property.price : "";
        var bedrooms = (this.state.property.bedrooms) ? this.state.property.bedrooms : "";
        var bathrooms = (this.state.property.bathrooms) ? this.state.property.bathrooms : "";
        var squareFootage = (this.state.property.squareFootage) ? this.state.property.squareFootage : "";
        var yearBuilt = (this.state.property.yearBuilt) ? this.state.property.yearBuilt : "";
        var heating = (this.state.property.heating) ? this.state.property.heating : "";
        var cooling = (this.state.property.cooling) ? this.state.property.cooling : "";
        var rent = (this.state.property.rent) ? this.state.property.rent : "";
        var documents = [];// = (this.state.property.documents) ? this.state.property.documents : null;
        var numDocuments = 0; //(this.state.property.documents) ? this.state.property.documents.length : 0;

        this.setState({
            picture: picture,
            description: description,
            address: address,
            price: price,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            squareFootage: squareFootage,
            yearBuilt: yearBuilt,
            heating: heating,
            cooling: cooling,
            rent: rent,
            documents: documents,
            numDocuments: numDocuments
        })
    }

    // Input handlers for add screen
    onPictureChange(event) {
        this.setState({picture: event.target.files[0]});
    }

    onDescriptionChange(event) {
        this.setState({description: event.target.value});
    }
    
    onAddressChange(event) {
        this.setState({address: event.target.value});
    }

    onPriceChange(event) {
        this.setState({price: event.target.value});
    }

    onBedroomsChange(event) {
        this.setState({bedrooms: event.target.value});
    }

    onBathroomsChange(event) {
        this.setState({bathrooms: event.target.value});
    }

    onSquareFootageChange(event) {
        this.setState({squareFootage: event.target.value});
    }

    onYearBuiltChange(event) {
        this.setState({yearBuilt: event.target.value});
    }

    onHeatingChange(event) {
        this.setState({heating: event.target.value});
    }

    onCoolingChange(event) {
        this.setState({cooling: event.target.value});
    }

    onRentChange(event) {
        this.setState({rent: event.target.value});
    } 

    onDocumentChange(file, index) {
        var newDocuments = this.state.documents;
        if (index >= this.state.documents.length) {
            newDocuments.push(file);
        } else {
            newDocuments[index] = file;
        }
        this.setState({documents: newDocuments});
    } 
    
    addDocument() {
        this.setState(prevState => ({
            numDocuments: prevState.numDocuments + 1,
            documents: [...prevState.documents, null]
        }));  
    }

    removeDocument() {
        this.setState(prevState => ({
            numDocuments: prevState.numDocuments - 1,
            documents: prevState.documents.slice(0, prevState.documents.length - 1)
        }));  
    }//

    submitProperty() {
        var property = {
            id: this.props.id,
            picture: this.state.picture,
            description: this.state.description,
            address: this.state.address,
            bedrooms: this.state.bedrooms,
            bathrooms: this.state.bathrooms,
            squareFootage: this.state.squareFootage,
            yearBuilt: this.state.yearBuilt,
            heating: this.state.heating,
            cooling: this.state.cooling,
            price: this.state.price,
            rent: this.state.rent,
            documents: this.state.documents
        };
        this.props.submitProperty(property);
        this.setState({
            picture: null,
            description: "",
            address: "",
            bedrooms: "",
            bathrooms: "",
            squareFootage: "",
            yearBuilt: "",
            heating: "",
            cooling: "",
            price: "",
            rent: "",
            documents: [],
            numDocuments: 0
        })
    }

    onSubmitPropertyClicked(e) {
        e.stopPropagation();
    }
   
    componentDidMount() {
        //handle import of previous attributbes
        if(this.state.type === "update" && this.state.picture === null && this.state.property !== null) {
            this.addFields();
        }
    }
   
    render() {


        //handle title
        let title;
        if(this.state.type === "update") {
            title = <div className="submitPropertyTitle">Update Property</div>
        } else if(this.state.type === "add") {
            title = <div className="submitPropertyTitle">Add Property</div>
        }

        //handle documents
        let documentsDiv = [];
        for(let i = 0; i < this.state.numDocuments; i++) {
            documentsDiv.push(
                <DocumentInput key={i} num ={i} document={this.state.documents[i]} onChange={this.onDocumentChange}/>
            );
        }

        //handle which button based on update/add
        let submitButton;
        if(this.state.type === "update") {
            submitButton = <button className="submitProperty" onClick={this.submitProperty}>Update</button>
        } else if (this.state.type === "add") {
            submitButton = <button className="submitProperty" onClick={this.submitProperty}>Submit</button>
        }

        return(
            <div className="submitPropertyComponentMobile" onClick={(e) => this.onSubmitPropertyClicked(e)}>
                <div className="submitPropertyScrollable">
                    {title}
                    <div className="addPictures">
                        <div className="propertiesPair">
                            <div className="propertiesText">Primary Picture</div>
                            <input className="propertiesPicture" type="file" onChange={this.onPictureChange}/>
                        </div>
                        <div className="propertiesPair">
                            <div className="propertiesText">Other Pictures (PNG)</div>
                            <button className="plus" onClick={this.addDocument}>+</button>
                            <button className="minus" onClick={this.removeDocument}>-</button>
                            {documentsDiv}
                        </div>
                    </div>
                    <div className="addTextFields">
                        <div className="descriptionPair">
                            <div className="propertiesText">Description</div>
                            <textarea className="addDescription" type="text" rows={4} value={this.state.description} onChange={this.onDescriptionChange}/>
                        </div>
                        <div className="propertiesPair">
                            <div className="propertiesText">Address</div>
                            <input className="propertiesTextInput" type="text" value={this.state.address} onChange={this.onAddressChange}/>
                        </div>
                        <div className="propertiesPair">
                            <div className="propertiesText">Price</div>
                            <input className="propertiesTextInput" type="text" value={this.state.price} onChange={this.onPriceChange}/>
                        </div>
                        <div className="propertiesPair">
                            <div className="propertiesText">Bedrooms</div>
                            <input className="propertiesTextInput" type="text" value={this.state.bedrooms} onChange={this.onBedroomsChange}/>
                        </div>
                        <div className="propertiesPair">
                            <div className="propertiesText">Bathrooms</div>
                            <input className="propertiesTextInput" type="text" value={this.state.bathrooms} onChange={this.onBathroomsChange}/>
                        </div>
                        <div className="propertiesPair">
                            <div className="propertiesText">Square Footage</div>
                            <input className="propertiesTextInput" type="text" value={this.state.squareFootage} onChange={this.onSquareFootageChange}/>
                        </div>
                        <div className="propertiesPair">
                            <div className="propertiesText">Year Built</div>
                            <input className="propertiesTextInput" type="text" value={this.state.yearBuilt} onChange={this.onYearBuiltChange}/>
                        </div>
                        <div className="propertiesPair">
                            <div className="propertiesText">Heating</div>
                            <input className="propertiesTextInput" type="text" value={this.state.heating} onChange={this.onHeatingChange}/>
                        </div>
                        <div className="propertiesPair">
                            <div className="propertiesText">Cooling</div>
                            <input className="propertiesTextInput" type="text" value={this.state.cooling} onChange={this.onCoolingChange}/>
                        </div>
                        <div className="propertiesPair">
                            <div className="propertiesText">Monthly Rent</div>
                            <input className="propertiesTextInput" type="text" value={this.state.rent} onChange={this.onRentChange}/>
                        </div>
                    </div>
                </div>
                {submitButton}
                <button className="closeAdd" onClick={this.props.addCloseClicked}>x</button>
            </div>
        );
    }
}

export default SubmitProperty;