import React, {Component} from 'react';
import {Login} from '../components/core';

class LoginTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };

        this.inputEmail = (value) => {
            this.setState({
                email: value
            })
        };

        this.inputPassword = (value) => {
            this.setState({
                password: value
            })
        }
        console.log(this.props)
    }

    render() {

        return (
            <React.Fragment>
                <Login.MailAddressInput onChange={this.inputEmail}/>
                <Login.PasswordInput onChange={this.inputPassword}/>
                <Login.LoginButton email={this.state.email} password={this.state.password} signIn={this.props.actions.messages.signIn}/>
            </React.Fragment>
        );
    }
}

export default LoginTemplate