import React from 'react';
import axios from 'axios';
import './Browse.css';
import PropertyListItem from './PropertyListItem';
import ViewProperty from './ViewProperty';
import PopUp from '.././PopUp';
import searchGlass from './../images/searchBlackWhite.png';
import ClipLoader from "react-spinners/ClipLoader";

class Browse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          search: "",
          dropdown: "Age",
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
        this.setState({search: ""});
        //this.setState({search: event.target.value});
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
                description: response.data.property.description,
                address: response.data.property.address, 
                price: response.data.property.price, 
                bedrooms: response.data.property.bedrooms,
                bathrooms: response.data.property.bathrooms,
                squareFootage: response.data.property.squareFootage,
                yearBuilt: response.data.property.yearBuilt,
                heating: response.data.property.heating,
                cooling: response.data.property.cooling,
                rent: response.data.property.rent, 
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
        this.setState({showView: true});
        
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
                propertyView = <ViewProperty property={this.state.viewProperty} closeView={this.closeView}/>
            } else {
                propertyView = <div className="propertyViewMobile">
                    <button className="closeView" onClick={this.closeView}>x</button>
                    <ClipLoader
                        loading={true}
                        color="#010101"
                        css="
                            position absolute; 
                            top: 50%;
                            left: 50%;
                            transform: translate(50%, 50%);
                        "
                    />
                </div>
            }
        }
        console.log(this.state.showView);
        
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
            <div className="Browse" onClick={this.closeView}>
                {/* <img className="search" src={searchGlass} alt="search"/>
                <input className="search" type="text" value={this.state.search} onChange={this.handleChangeSearch}/>
                <div className="sortBy">Sort By:</div>
                <select 
                    className="dropdown"
                    value={this.state.dropdown} 
                    onChange={this.handleChangeDropdown} 
                >
                    <option value="Age">Age</option>
                    <option value="Price">Price</option>
                    <option value="New">New</option>
                    <option value="Cap Rate">Cap Rate</option>
                </select>   */}
                <div className="propertiesListMobile">{propertiesList}</div>  
                {propertyView}
                {popUp}   
            </div>
        );
    }
}

export default Browse;