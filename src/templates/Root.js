import React, {Component} from "react";
import {SendToContainer} from "../containers/SendTo";
import {ChatContainer} from "../containers/Chat";
import {ConfigurationContainer} from "../containers/Configuration";
import {LoginContainer} from "../containers/Login";

class RootTemplate extends Component {
    constructor(props) {
        super(props);
    }



    render() {
        const isLogined = (this.props.messages.userId !== "");
        const isRoomSelected = (this.props.messages.roomId !== "");
        const isConfigured = (this.props.messages.isConfigured);

        return (
            <div className="c-grid">
                <div className="p-box__content">
                    {(!isLogined) && (
                        <LoginContainer />
                    )}
                    {(isLogined && !isRoomSelected) && (
                        <SendToContainer/>
                    )}
                    {(isLogined && isRoomSelected && !isConfigured) && (
                        <ChatContainer/>
                    )}
                    {(isLogined && isRoomSelected && isConfigured) && (
                        <ConfigurationContainer/>
                    )}
                </div>
            </div>
        )
    }
}

export default RootTemplate