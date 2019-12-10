import React, {Component} from "react";
import {SendToContainer} from "../containers/SendTo";
import {ChatContainer} from "../containers/Chat";
import {ConfigurationContainer} from "../containers/Configuration";
import {LoginContainer} from "../containers/Login";

class RootTemplate extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        console.log(this.props)
        const isLogined = (this.props.messages.userId !== "");
        const isRoomSelected = (this.props.messages.roomId !== "");
        const isConfigured = (this.props.messages.isConfigured);

        return (
            <div className="col-lg-9 col-md-10 col-sm-12 col-xs-12 c-grid__column">
                {(!isLogined) && (
                <div className="p-box__content">
                    <LoginContainer />
                </div>
                )}
                {(isLogined && !isRoomSelected) && (
                <div className="p-box__content">
                    <SendToContainer/>
                </div>
                )}
                {(isLogined && isRoomSelected && !isConfigured) && (
                <div className="p-box__content">
                    <ChatContainer/>
                </div>
                )}
                {(isLogined && isRoomSelected && isConfigured) && (
                <div className="p-box__content">
                    <ConfigurationContainer/>
                </div>
                )}
            </div>
        )
    }
}

export default RootTemplate