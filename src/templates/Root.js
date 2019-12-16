import React, {Component} from "react";
import {SendToContainer} from "../containers/SendTo";
import {ChatContainer} from "../containers/Chat";
import {ConfigurationContainer} from "../containers/Configuration";
import {LoginContainer} from "../containers/Login";
import {firebaseApp, database} from "../firebase";

class RootTemplate extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        const doesUserExist = async () => {
            return database.ref('users').once('value', (snapshot) => { return snapshot })
        };

        const createUserValue = async (id) => {
            return database.ref('users').update({
                [id]: {
                    photoPath: "https://firebasestorage.googleapis.com/v0/b/react-chat-28bf1.appspot.com/o/images%2Fno-profile-icon.jpg?alt=media&token=056753ee-3755-4b4e-bff1-a8ef8b614a6b"
                }
            })
        };

        firebaseApp.auth().onAuthStateChanged(async user => {
            if (user) {
                const snapshot = await doesUserExist();
                if (!Object.keys(snapshot.val()).includes(user.uid)) {
                    await createUserValue(user.uid)
                }

                this.props.actions.messages.signIn({
                    userId: user.uid,
                    userPhoto: "https://firebasestorage.googleapis.com/v0/b/react-chat-28bf1.appspot.com/o/images%2Fno-profile-icon.jpg?alt=media&token=056753ee-3755-4b4e-bff1-a8ef8b614a6b"
                })
            }
        })
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