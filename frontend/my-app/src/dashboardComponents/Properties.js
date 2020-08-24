import React from 'react';
import PropertyListItem from './PropertyListItem';
import SubmitProperty from './SubmitProperty';
import ViewProperty from './ViewProperty';
import PopUp from '.././PopUp';
import ClipLoader from "react-spinners/ClipLoader";
import imageCompression from 'browser-image-compression';

import axios from 'axios';
import './Properties.css';

class Properties extends React.Component {
    constructor(props) {
        super(props);
        //Weird but most of this state is only for the "Add Screen". 
        //You can only add one property at a time so it works
        this.state = {
            addClicked: false,
            editClicked: false,
            editProperty: null,
            publishClicked: false,
            toPublish: null,
            unpublishClicked: false,
            toUnpublish: null,
            maxPublished: false,
            deleteClicked: false,
            showView: false,
            viewProperty: null,
            toDelete: null,
            hasDeleted: [],
            unsaveClicked: false,
            toUnsave: null,
            okPopUp: false,
            popUpText: ""
        };
    
        this.addClicked = this.addClicked.bind(this);
        this.addCloseClicked = this.addCloseClicked.bind(this);
        this.editClicked = this.editClicked.bind(this);
        this.editCloseClicked = this.editCloseClicked.bind(this);
        this.submitProperty = this.submitProperty.bind(this);
        this.editProperty = this.editProperty.bind(this);
        this.openChat = this.openChat.bind(this);
        this.publishProperty = this.publishProperty.bind(this);
        this.unpublishProperty = this.unpublishProperty.bind(this);
        this.onViewClicked = this.onViewClicked.bind(this);
        this.closeView = this.closeView.bind(this);
        this.getProperty = this.getProperty.bind(this);
        this.deleteProperty = this.deleteProperty.bind(this);
        this.unsaveProperty = this.unsaveProperty.bind(this);
        this.onPublishClicked = this.onPublishClicked.bind(this);
        this.onUnpublishClicked = this.onUnpublishClicked.bind(this);
        this.onMaxPublishClicked = this.onMaxPublishClicked.bind(this);
        this.onDeleteClicked = this.onDeleteClicked.bind(this);
        this.onUnsaveClicked = this.onUnsaveClicked.bind(this);
        this.okPopUpClicked = this.okPopUpClicked.bind(this);
    }

    addClicked() {
        this.setState(prevState => ({
            addClicked: !prevState.addClicked
        }));
    }

    addCloseClicked() {
        this.setState({addClicked: false});
    }

    editClicked(id) {
        this.getProperty(id, "EDIT")
        this.setState(prevState => ({
            editClicked: !prevState.editClicked
        }));
    }

    editCloseClicked() {
        this.setState({editClicked: false, editProperty: null});
    }


    async submitProperty(property) {
        //id picture owner address price rent cap published
        // let data = JSON.stringify({
        //     picture: this.state.picture,
        //     address: this.state.address,
        //     price: this.state.price,
        //     rent: this.state.rent,
        //     documents: this.state.documents
        // });
        if(property.picture === null || property.address === null || property.price === null) {
            alert("Picture, Address, and Price cannot be empty");
            return;
        }
        //make picture smaller
        const imageFile = property.picture;
        var compressedFile;
        var compressedSmall;
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 485,
            useWebWorker: true
        }
        const optionsSmall = {
            maxSizeMB: 1,
            maxWidthOrHeight: 135,
            useWebWorker: true
        }
        try {
            compressedFile = await imageCompression(imageFile, options);
            compressedSmall = await imageCompression(imageFile, optionsSmall);
        
        } catch (error) {
            console.log(error);
        }



        let formData = new FormData();
        formData.append('picture', compressedFile, 'Picture.png');
        formData.append('pictureSmall', compressedSmall, 'PictureSmall.png');
        formData.append('description', property.description);
        formData.append('address', property.address);
        formData.append('bedrooms', property.bedrooms);
        formData.append('bathrooms', property.bathrooms);
        formData.append('squareFootage', property.squareFootage);
        formData.append('yearBuilt', property.yearBuilt);
        formData.append('heating', property.heating);
        formData.append('cooling', property.cooling);
        formData.append('price', property.price);
        formData.append('rent', property.rent);
        formData.append('owner', this.props.username);
        property.documents.map(async (document, index) => {
            //documents already compressed in DocumentInput.js
            formData.append('documents', document, 'Document' + index + '.png')
        });
        
        axios.post('https://www.realexinvest.com:8443/addProperty', formData, {
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
            this.setState({
                addClicked: false, okPopUp: true, popUpText: "Property added, please refresh page"
            });
        })
    }

    editProperty(property) {
        //id picture owner address price rent cap published
        // let data = JSON.stringify({
        //     picture: this.state.picture,
        //     address: this.state.address,
        //     price: this.state.price,
        //     rent: this.state.rent,
        //     documents: this.state.documents
        // });
        if(property.picture === null || property.address === null || property.price === null) {
            alert("Picture, Address, and Price cannot be empty");
            return;
        }
        let formData = new FormData();
        formData.append('id', this.state.editProperty.id);
        formData.append('picture', property.picture, 'Picture.png');
        formData.append('description', property.description);
        formData.append('address', property.address);
        formData.append('bedrooms', property.bedrooms);
        formData.append('bathrooms', property.bathrooms);
        formData.append('squareFootage', property.squareFootage);
        formData.append('yearBuilt', property.yearBuilt);
        formData.append('heating', property.heating);
        formData.append('cooling', property.cooling);
        formData.append('price', property.price);
        formData.append('rent', property.rent);
        formData.append('owner', this.props.username);
        property.documents.map((document, index) => 
            formData.append('documents', document, 'Document' + index + '.png')
        );
        
        axios.post('https://www.realexinvest.com:8443/editProperty', formData, {
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
            this.setState({
                editClicked: false, 
                okPopUp: true, 
                popUpText: "Property changed, please refresh page",
                editProperty: null
            });
        })
    }

    openChat(owner) {
        this.props.chat(owner);
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
        axios.post("https://www.realexinvest.com:8443/publishProperty", data,  {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
        }).then(response => {
            alert("ASDFASFASDFASDFA");
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
        axios.post("https://www.realexinvest.com:8443/unpublishProperty", data,  {
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

    async getProperty(id, set) {
        let data = JSON.stringify({
            id: id
        });
        axios.post("https://www.realexinvest.com:8443/getProperty", data,  {
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
            if(set === "VIEW")
                this.setState({showView: true, viewProperty: property});
            else if(set === "EDIT")
                this.setState({editClicked: true, editProperty: property});
        })
        .catch(error => {
            console.log("check login error", error);
        });
    }

    async onViewClicked(property) {
        this.getProperty(property.id, "VIEW");
        this.setState({showView:true});
    }

    closeView() {
        this.setState({showView: false, viewProperty: null})
    }

    deleteProperty() {
        if(this.state.hasDeleted.includes(this.state.toDelete)) {
            this.setState((prevState) => ({
                toDelete: null, 
                deleteClicked: false,
                okPopUp: true, 
                popUpText: "Property already deleted, please refresh page",
            }));
            return;
        }
        let data = JSON.stringify({
            id: this.state.toDelete,
            username: this.props.username
        });
        axios.post("https://www.realexinvest.com:8443/deleteProperty", data,  {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
        }).then(response => {
            if(response.data.result) {
                //this.props.rerender();
                this.setState((prevState) => ({
                    toDelete: null, 
                    deleteClicked: false,
                    okPopUp: true, 
                    popUpText: "Property deleted, please refresh page",
                    hasDeleted: [...prevState.hasDeleted, prevState.toDelete]
                }));
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
        axios.post("https://www.realexinvest.com:8443/unsaveProperty", data,  {
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

    okPopUpClicked() {
        this.setState({okPopUp: false, popUpText: ""});
    }
    
    
    render() {
        //filter for owned properties
        let myPropertiesList = this.props.properties.filter((property) =>
        property.owner == this.props.username
        ).map((property, index) => {
            return <div key={index}><PropertyListItem 
                key={index} 
                property={property} 
                onView={this.onViewClicked}
                buttonText="Edit" 
                onButtonClicked={() => this.editClicked(property.id)}
                deleteButton={true}
                deleteFunction={() => this.onDeleteClicked(property.id)}
                username={this.props.username}
            /></div>
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
                onButtonClicked={() => this.openChat(property.owner)}
                deleteButton={true}
                deleteFunction={() => this.onUnsaveClicked(property.id)}
            />
        );

        //handles view screen
        let propertyView;
        if(this.state.showView) {
            if(this.state.viewProperty) {
                propertyView = <ViewProperty property={this.state.viewProperty} closeView={this.closeView}/>
            } else {
                propertyView = <div className="propertyView">
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

        //handle add screen
        let addScreen;
        if(this.state.addClicked) {
            addScreen = <SubmitProperty
                type="add"
                addCloseClicked={this.addCloseClicked}
                submitProperty = {this.submitProperty}
            />
        }

        //handle edit screen
        let editScreen;
        if(this.state.editClicked) {
            if(this.state.editProperty) {
                editScreen = <SubmitProperty
                    type="update"
                    addCloseClicked={this.editCloseClicked}
                    submitProperty = {this.editProperty}
                    property = {this.state.editProperty}
                />
            } else {
                editScreen = <div className="propertyView">
                    <button className="closeView" onClick={this.editCloseClicked}>x</button>
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
        } else if(this.state.okPopUp) {
            popUp = <PopUp
                type="ok"
                text={this.state.popUpText}
                okFunction={this.okPopUpClicked}
            />
        }

        return(
            <div className="propertiesTab">
                <div className="myProperties">Owned Properties</div>
                <button className="add" onClick={this.addClicked}>Add</button>
                <div className='myPropertiesList'>{myPropertiesList}</div>
                <div className="savedProperties">Saved Properties</div>
                <div className='savedPropertiesList'>{savedPropertiesList}</div>
                {propertyView}
                {addScreen}
                {editScreen}
                {popUp}
            </div>
        );
    }
}

export default Properties;