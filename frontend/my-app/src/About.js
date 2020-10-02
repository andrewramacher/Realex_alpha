import React from 'react';
import axios from 'axios';
import './About.css';

class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    
        //this.submit = this.submit.bind(this);
    }

    render() {
        return (
          <div className="About">
            <h1>Welcome to Real Express</h1>
            <h2>How It Works</h2>
            <div>
                Buying:
                <ol>
                    <li>Browse properties</li>
                    <li>Save properties</li>
                    <li>Chat with owners</li>
                    <li>If owner is Admin contact info in description</li>
                    <li>Click "Ready to Transact"</li>
                    <li>We guide you through buying process (title, escrow, and mortgage)</li>
                    <li>You pay us nothing</li>
                </ol>
                <br/>
                Selling:
                <ol>
                    <li>Post property</li>
                    <li>Contact us to publish</li>
                    <li>Get messages</li>
                    <li>Click "Ready to Transact"</li>
                    <li>We guide you through selling process (title, escrow, and mortgage)</li>
                    <li>You pay us nothing</li>
                </ol>
                <br/>
            </div>
            <h2>Contact Us</h2>
            <div>
                Please reach out with any questions or feedback!<br/>
                <br/>
                Email: help@realexinvest.com<br/>
                or use Chat to message Admin<br/>
                <br/>
                Forgot Password? Email help@realexinvest.com from your account email to reset
            </div>
          </div>
        );
    }
}

export default About;