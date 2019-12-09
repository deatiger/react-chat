import React, {Component} from "react";
import {SendToContainer} from "../containers/SendTo";
import {ChatContainer} from "../containers/Chat";
import {ConfigurationContainer} from "../containers/Configuration";

class Root extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="col-12 c-grid__column">
                {(this.props.messages.roomId === "") && (
                <div className="p-box__content">
                    <SendToContainer/>
                </div>
                )}
                {(this.props.messages.roomId !== "" && !(this.props.messages.isConfigured)) && (
                <div className="p-box__content">
                    <ChatContainer/>
                </div>
                )}
                {(this.props.messages.roomId !== "" && (this.props.messages.isConfigured)) && (
                <div className="p-box__content">
                    <ConfigurationContainer/>
                </div>
                )}
            </div>
        )
    }
}

export default Root