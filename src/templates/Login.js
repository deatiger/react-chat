import React, {Component} from 'react';
import {Login} from '../components/core';

class LoginTemplate extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <React.Fragment>
                <div className="c-grid__column p-3">
                    <Login.TwitterLoginButton signIn={this.props.actions.messages.twitterSignIn}/>
                    <Login.AnonymousLoginButton signIn={this.props.actions.messages.anonymousSignIn}/>
                </div>
            </React.Fragment>
        );
    }
}

export default LoginTemplate