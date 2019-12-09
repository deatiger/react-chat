import React, {Component} from 'react';
import {Login} from '../components/core';
import * as Common from "../components/core/Common";
import {database} from '../firebase/index'

class LoginTemplate extends Component {
    constructor(props) {
        super(props);

    }

    componentDidUpdate() {
        const scrollArea = document.getElementById("scroll-area");
        scrollArea.scrollTop = scrollArea.scrollHeight;
    }

    componentWillUnmount() {
        if (this.props.messages.roomId !== "") {
            return this.chatMemberRef.child(this.props.messages.userId).child(this.props.messages.roomId).off()
        }
    }

    render() {
        return (
            <React.Fragment>
                <Login.UsernameInput />
                <Login.PasswordInput />
                <Login.LoginButton />
            </React.Fragment>
        );
    }
}

export default LoginTemplate