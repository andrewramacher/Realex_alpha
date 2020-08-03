import React from 'react';
import PropertyListItem from './PropertyListItem';
import DocumentInput from './DocumentInput';
import PopUp from '.././PopUp';
import axios from 'axios';
import './Properties.css';

class Properties extends React.Component {
    constructor(props) {
        super(props);
        //Weird but most of this state is only for the "Add Screen". 
        //You can only add one property at a time so it works
        this.state = {
            addClicked: false,
            picture: null,
            address: "",
            price: "",
            rent: "",
            documents: [],
            numDocuments: 0,
            publishClicked: false,
            toPublish: null,
            unpublishClicked: false,
            toUnpublish: null,
            maxPublished: false,
            deleteClicked: false,
            toDelete: null,
            unsaveClicked: false,
            toUnsave: null
        };
    
        this.addClicked = this.addClicked.bind(this);
        this.addCloseClicked = this.addCloseClicked.bind(this);
        this.onPictureChange = this.onPictureChange.bind(this);
        this.onAddressChange = this.onAddressChange.bind(this);
        this.onPriceChange = this.onPriceChange.bind(this);
        this.onRentChange = this.onRentChange.bind(this);
        this.onDocumentChange = this.onDocumentChange.bind(this);
        this.addDocument = this.addDocument.bind(this);
        this.removeDocument = this.removeDocument.bind(this);
        this.submitProperty = this.submitProperty.bind(this);
        this.openChat = this.openChat.bind(this);
        this.publishProperty = this.publishProperty.bind(this);
        this.unpublishProperty = this.unpublishProperty.bind(this);
        this.deleteProperty = this.deleteProperty.bind(this);
        this.unsaveProperty = this.unsaveProperty.bind(this);
        this.onPublishClicked = this.onPublishClicked.bind(this);
        this.onUnpublishClicked = this.onUnpublishClicked.bind(this);
        this.onMaxPublishClicked = this.onMaxPublishClicked.bind(this);
        this.onDeleteClicked = this.onDeleteClicked.bind(this);
        this.onUnsaveClicked = this.onUnsaveClicked.bind(this);
    }

    addClicked() {
        this.setState(prevState => ({
            addClicked: !prevState.addClicked
        }));
    }

    addCloseClicked() {
        this.setState({addClicked: false});
    }

    // Input handlers for add screen
    onPictureChange(event) {
        this.setState({picture: event.target.files[0]});
    }

    onAddressChange(event) {
        this.setState({address: event.target.value});
    }

    onPriceChange(event) {
        this.setState({price: event.target.value});
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
        //id picture owner address price rent cap published
        // let data = JSON.stringify({
        //     picture: this.state.picture,
        //     address: this.state.address,
        //     price: this.state.price,
        //     rent: this.state.rent,
        //     documents: this.state.documents
        // });
        if(this.state.picture === null || this.state.address === null || this.state.price === null || this.state.rent === null) {
            alert("First 4 fields cannot be empty");
            return;
        }
        let formData = new FormData();
        formData.append('picture', this.state.picture, 'Picture.png');
        formData.append('address', this.state.address);
        formData.append('price', this.state.price);
        formData.append('rent', this.state.rent);
        formData.append('owner', this.props.username);
        this.state.documents.map((document, index) => 
            formData.append('documents', document, 'Document' + index + '.png')
        );
        
        axios.post('http://127.0.0.1:8080/addProperty', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        }).then(response => {
            //do something if response is error

            // if (response.data.success === true) {
            //     alert("Property Added, refresh page to see");
            // }
            // else {

            // }
            //This does not seem to be firing
            this.setState({
                addClicked: false,
                picture: null,
                address: "",
                price: "",
                rent: "",
                documents: [],
                numDocuments: 0
            });
        })
    }

    onViewClicked() {

    }

    openChat() {

    }

    publishProperty() {
        //Check to see if user can publish property
        if(this.props.user.numPublished >= this.props.user.canPublish) {
            this.setState({maxPublished: true, publishClicked: false, toPublish: null});
        }
        //publish property (don't forget to put max pubish check in server too just in case)
        let data = JSON.stringify({
            id: this.state.toPublish,
            username: this.props.username
        });
        axios.post("http://127.0.0.1:8080/publishProperty", data,  {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
        }).then(response => {
            //Make sure there isn't a way to cheat the system by bybassing local count

            // if(response.data.result) {
            //     //Get dashboard to re render
            //     this.setState({toPublish: null, publishClicked: false});
            // } else {
            //     this.setState({maxPublished: true, publishClicked: false});
            // }
        })
        .catch(error => {
            console.log("check login error", error);
        });
        this.props.publishProperty(this.state.toPublish);
        this.setState({toPublish: null, publishClicked: false});

    }

    onPublishClicked(id=null) {
        const newVal = !this.state.publishClicked;
        if (!newVal) id = null;
        this.setState({publishClicked: newVal, toPublish: id});
    }

    onMaxPublishClicked() {
        this.setState({maxPublished: false});
    }

    unpublishProperty(){
        //publish property (don't forget to put max pubish check in server too just in case)
        let data = JSON.stringify({
            id: this.state.toUnpublish,
            username: this.props.username
        });
        axios.post("http://127.0.0.1:8080/unpublishProperty", data,  {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
        }).then(response => {
            //check publish property

            // if(response.data.result) {
            //     //Get dashboard to re render
            //     this.props.unpublishProperty(this.state.toUnpublish);
            //     this.setState({toUnpublish: null, unpublishClicked: false});
            // } else {
            //     this.setState({toUnpublish: null, unpublishClicked: false});
            // }
        })
        .catch(error => {
            console.log("check login error", error);
        });
        this.props.unpublishProperty(this.state.toUnpublish);
        this.setState({toUnpublish: null, unpublishClicked: false});
    }

    onUnpublishClicked(id=null) {
        const newVal = !this.state.unpublishClicked;
        if (!newVal) id = null;
        this.setState({unpublishClicked: newVal, toUnpublish: id});
    }

    deleteProperty() {
        let data = JSON.stringify({
            id: this.state.toDelete,
            username: this.props.username
        });
        axios.post("http://127.0.0.1:8080/deleteProperty", data,  {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
        }).then(response => {
            if(response.data.result) {
                //this.props.rerender();
                this.setState({toDelete: null, deleteClicked: false});
            }
        })
        .catch(error => {
            console.log("check login error", error);
        });
    }

    onDeleteClicked(id=null) {
        const newVal = !this.state.deleteClicked;
        if (!newVal) id = null;
        this.setState({deleteClicked: newVal, toDelete: id});
    }

    unsaveProperty() {
        this.props.unsaveProperty(this.state.toUnsave);
        let data = JSON.stringify({
            id: this.state.toUnsave,
            username: this.props.username
        });
        axios.post("http://127.0.0.1:8080/unsaveProperty", data,  {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
        }).then(response => {
            //could be bad, unsaved locally but stil saved in database (check else)

            // if(response.data.result) {
            //     //Get dashboard to re render
            //     this.setState({toUnsave: null, unsaveClicked: false});
            // } else {
            //     //could be bad, unsaved locally but stil saved in database
            //     this.setState({toUnsave: null, unsaveClicked: false});
            // }
        })
        .catch(error => {
            console.log("check login error", error);
        });
        this.setState({toUnsave: null, unsaveClicked: false});
    }

    onUnsaveClicked(id=null) {
        const newVal = !this.state.unsaveClicked;
        if (!newVal) id = null;
        this.setState({unsaveClicked: newVal, toUnsave: id});
    }
    
    
    render() {
        //filter for owned properties
        let myPropertiesList = this.props.properties.filter((property) =>
        property.owner == this.props.username
        ).map((property, index) => {
            if(property.published) {
                return <div key={index}><PropertyListItem 
                    key={index} 
                    property={property} 
                    onView={this.onViewClicked}
                    buttonText="Unpublish" 
                    onButtonClicked={() => this.onUnpublishClicked(property.id)}
                    deleteButton={true}
                    deleteFunction={() => this.onDeleteClicked(property.id)}
                /></div>
            } else {
                return <div key={index}><PropertyListItem 
                    property={property} 
                    onView={this.onViewClicked}
                    buttonText="Publish" 
                    onButtonClicked={() => this.onPublishClicked(property.id)}
                    deleteButton={true}
                    deleteFunction={() => this.onDeleteClicked(property.id)}
                /></div>
            }
        });

        //filter for saved properties
        let savedPropertiesList = this.props.properties.filter((property) => {
            return this.props.user.saved.includes(property.id)
        }
        ).map((property, index) =>
            <PropertyListItem 
                key={index} 
                property={property} 
                onView={this.onViewClicked}
                buttonText="Chat" 
                onButtonClicked={this.openChat}
                deleteButton={true}
                deleteFunction={() => this.onUnsaveClicked(property.id)}
            />
        );

        //handle add screen
        let addScreen;
        if(this.state.addClicked) {
            let documentsDiv = [];
            for(let i = 0; i < this.state.numDocuments; i++) {
                documentsDiv.push(
                    <DocumentInput key={i} num ={i} document={this.state.documents[i]} onChange={this.onDocumentChange}/>
                );
            }
            addScreen = <div className="addScreen">
                <button className="close" onClick={this.addCloseClicked}>x</button>
                <div className="propertiesText">Picture</div>
                <input className="propertiesPicture" type="file" onChange={this.onPictureChange} />
                <div className="propertiesText">Address</div>
                <input className="propertiesAddress" type="text" value={this.state.address} onChange={this.onAddressChange}/>
                <div className="propertiesText">Price</div>
                <input className="propertiesPrice" type="text" value={this.state.price} onChange={this.onPriceChange}/>
                <div className="propertiesText">Monthly Rent</div>
                <input className="propertiesRent" type="text" value={this.state.rent} onChange={this.onRentChange}/>
                <div className="propertiesText">Other Documents (PNG, JPG, PDF)</div>
                <button className="plus" onClick={this.addDocument}>+</button>
                <button className="minus" onClick={this.removeDocument}>-</button>
                {documentsDiv}
                <button className="submitProperty" onClick={this.submitProperty}>Submit</button>
            </div>
        }

        //handle popup
        let popUp;
        if(this.state.deleteClicked) {
            popUp = <PopUp
                type="yesno"
                text="Are you sure you want to delete this property?"
                yesFunction={this.deleteProperty}
                noFunction={this.onDeleteClicked}
            />
        } else if(this.state.unsaveClicked) {
            popUp = <PopUp
                type="yesno"
                text="Are you sure you want to unsave this property?"
                yesFunction={this.unsaveProperty}
                noFunction={this.onUnsaveClicked}
            />
        } else if(this.state.publishClicked) {
            popUp = <PopUp
                type="yesno"
                text="Are you sure you want to publish this property?"
                yesFunction={this.publishProperty}
                noFunction={this.onPublishClicked}
            />
        } else if(this.state.maxPublished) {
            popUp = <PopUp
                type="ok"
                text="You cannot publish more properties. Contact admin for more."
                okFunction={this.onMaxPublishClicked}
            />
        } else if(this.state.unpublishClicked) {
            popUp = <PopUp
                type="yesno"
                text="Are you sure you want to unpublish this property?"
                yesFunction={this.unpublishProperty}
                noFunction={this.onUnpublishClicked}
            />
        }

        return(
            <div className="propertiesTab">
                <div className="myProperties">Owned Properties</div>
                <button className="add" onClick={this.addClicked}>Add</button>
                <div className='myPropertiesList'>{myPropertiesList}</div>
                <div className="savedProperties">Saved Properties</div>
                <div className='savedPropertiesList'>{savedPropertiesList}</div>
                {addScreen}
                {popUp}
            </div>
        );
    }
}

export default Properties;