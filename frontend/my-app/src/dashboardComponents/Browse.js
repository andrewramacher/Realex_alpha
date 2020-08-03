import React from 'react';
import axios from 'axios';
import './Browse.css';
import PropertyListItem from './PropertyListItem';
import PopUp from '.././PopUp';
import searchGlass from './../images/search.png';

class Browse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          search: "",
          dropdown: "Price",
          properties: [],
          showView: false,
          viewProperty: null,
          saveClicked: false,
          toSave: null
        };
    
        this.handleChangeSearch = this.handleChangeSearch.bind(this);
        this.handleChangeDropdown = this.handleChangeDropdown.bind(this);
        this.onViewClicked = this.onViewClicked.bind(this);
        this.closeView = this.closeView.bind(this);
        this.onSaveClicked = this.onSaveClicked.bind(this);
        this.getProperty = this.getProperty.bind(this);
    }

    handleChangeSearch(event) {
        this.setState({search: event.target.value});
    }

    handleChangeDropdown(event) {
        this.setState({dropdown: event.target.value});
    }

    async getProperty(id) {
        let data = JSON.stringify({
            id: id
        });
        axios.post("http://127.0.0.1:8080/getProperty", data,  {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
        }).then(response => {
            var base64Flag = 'data:image/png;base64,';
            var documents;
            if(response.data.property.documents) {
                documents = response.data.property.documents.map((document) =>
                    base64Flag + document
                )
            }
            var property = {
                id: response.data.property._id, 
                picture: base64Flag + response.data.property.picture,
                owner: response.data.property.owner, 
                address: response.data.property.address, 
                price: response.data.property.price, 
                rent: response.data.property.rent, 
                cap: response.data.property.cap, 
                documents: documents
            };
            this.setState({showView: true, viewProperty: property});
        })
        .catch(error => {
            console.log("check login error", error);
        });
    }

    async onViewClicked(property) {
        this.getProperty(property.id);
        this.setState({showView:true});
    }

    closeView() {
        this.setState({showView: false, viewProperty: null})
    }

    onSaveClicked(property) {
        if(this.state.saveClicked) {
            this.props.saveProperty(this.state.toSave);
            this.setState({saveClicked: false});
        } else {
            this.setState({saveClicked: true, toSave: property});
        }
    }

    componentDidMount() {
    }

    render() {
        //handles if single property is selected
        let propertyView;
        if(this.state.showView) {
            if(this.state.viewProperty) {
                let documents;
                if(this.state.viewProperty.documents) { 
                    documents= this.state.viewProperty.documents.map( document =>
                        <img className="viewDocument" src={document}/>
                    );
                }
                propertyView = <div className="propertyView">
                    <button onClick={this.closeView}>x</button>
                    <img src={this.state.viewProperty.picture}/>
                    <div>{this.state.viewProperty.address}</div>
                    <div>{this.state.viewProperty.price}</div>
                    <div>{this.state.viewProperty.rent}</div>
                    <div>{this.state.viewProperty.cap}</div>
                    {documents}
                </div>
            } else {
                propertyView = <div className="propertyView">
                    <button onClick={this.closeView}>x</button>
                    <div>Loading...</div>
                </div>
            }
        }
        
        //Handles list of properties
        let propertiesList = this.props.properties.filter((property) =>
            property.published
        ).map((property, index) => {
            return <PropertyListItem 
                key={index} 
                property={property} 
                onView={this.onViewClicked} 
                buttonText="Save" 
                onButtonClicked={this.onSaveClicked}
            />;
        });

        //handle popup
        let popUp;
        if(this.state.saveClicked) {
            popUp = <PopUp
            type="ok"
            text="Property saved"
            okFunction={this.onSaveClicked}
            />
        }
        return(
            <div>
                <img className="search" src={searchGlass} alt="search"/>
                <input className="search" type="text" value={this.state.search} onChange={this.handleChangeSearch}/>
                <div className="sortBy">Sort By:</div>
                <select 
                    className="dropdown"
                    value={this.state.dropdown} 
                    onChange={this.handleChangeDropdown} 
                >
                    <option value="Price">Price</option>
                    <option value="New">New</option>
                    <option value="Cap Rate">Cap Rate</option>
                </select>  
                <div className="propertiesList">{propertiesList}</div>  
                {propertyView}
                {popUp}   
            </div>
        );
    }
}

export default Browse;