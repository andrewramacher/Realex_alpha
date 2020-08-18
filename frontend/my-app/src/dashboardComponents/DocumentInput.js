import React from 'react';

class DocumentInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            num: this.props.num,
            document: this.props.document
        };
    
        this.onDocumentChange = this.onDocumentChange.bind(this);
    }
    

    onDocumentChange(event) {
        this.props.onChange(event.target.files[0], this.state.num);
        this.setState({document: event.target.files[0]});
    } 
    
    render() {
        return(
            <input className="documentInput" type="file" files={this.state.document} onChange={this.onDocumentChange}/>
        );
    }
}

export default DocumentInput;