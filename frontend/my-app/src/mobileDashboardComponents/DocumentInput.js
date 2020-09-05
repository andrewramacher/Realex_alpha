import React from 'react';
import imageCompression from 'browser-image-compression';

class DocumentInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            num: this.props.num,
            document: this.props.document
        };
    
        this.onDocumentChange = this.onDocumentChange.bind(this);
    }
    

    async onDocumentChange(event) {
        var compressedFile;
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 485,
            useWebWorker: true
        }
        try {
            compressedFile = await imageCompression(event.target.files[0], options);
        
        } catch (error) {
            console.log(error);
        }
        this.props.onChange(compressedFile, this.state.num);
        this.setState({document: compressedFile});
    } 
    
    render() {
        return(
            <input className="documentInput" type="file" files={this.state.document} onChange={this.onDocumentChange}/>
        );
    }
}

export default DocumentInput;