import React, {Component} from 'react';
import {Login} from '../components/core';
import {database, firebaseApp} from "../firebase";
import {getDatetimeAsNumber, updateMultiPath} from "../functions";

class LoginTemplate extends Component {
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

        const createDefaultRoom = (userId) => {
            return new Promise((resolve, reject) => {
                const now = getDatetimeAsNumber()
                const businessAccountId = "JIZiG0O1cpfaO3EqFkRQLPeZL2H3"
                const chatAccountId = "cbaRWL7y0xR4VXoXxzpUnkFaoRv1"

                const businessTalk = {
                    name: "お仕事用チャット",
                    owner_id: businessAccountId,
                    updated_at: now,
                    updated_at_minus: -now,
                    user_ids: {
                        [businessAccountId]: businessAccountId,
                        [userId]: businessAccountId
                    }
                };

                const smallTalk = {
                    name: "雑談用チャット",
                    owner_id: chatAccountId,
                    updated_at: now,
                    updated_at_minus: -now,
                    user_ids: {
                        [chatAccountId]: chatAccountId,
                        [userId]: chatAccountId
                    }
                };

                const groupTalk = {
                    name: "グループチャット",
                    owner_id: businessAccountId,
                    room_icon: "https://firebasestorage.googleapis.com/v0/b/react-chat-28bf1.appspot.com/o/images%2Fno-image-square.png?alt=media&token=03d04110-aab2-4c03-9779-2293f40bb463",
                    updated_at: now,
                    updated_at_minus: -now,
                    user_ids: {
                        [businessAccountId]: businessAccountId,
                        [chatAccountId]: businessAccountId,
                        [userId]: businessAccountId
                    }
                };
                try {
                    const businessTalkRoom = database.ref('chatRoom').child(userId).push(businessTalk);
                    const smallTalkRoom = database.ref('chatRoom').child(userId).push(smallTalk);
                    const groupTalkRoom = database.ref('chatRoom').child(userId).push(groupTalk);

                    // Add rooms to default accounts' room value
                    const businessTalkPath = `chatRoom/${businessAccountId}/${businessTalkRoom.key}`;
                    const smallTalkPath = `chatRoom/${chatAccountId}/${smallTalkRoom.key}`;
                    const groupTalkPath = `chatRoom/${businessAccountId}/${groupTalkRoom.key}`;
                    const groupTalkPath2 = `chatRoom/${chatAccountId}/${groupTalkRoom.key}`;
                    updateMultiPath({
                        [businessTalkPath]: businessTalk,
                        [smallTalkPath]: smallTalk,
                        [groupTalkPath]: groupTalk,
                        [groupTalkPath2]: groupTalk
                    });
                    return resolve(null)
                } catch (e) {
                    console.error(e)
                    return reject(null)
                }

            })
        };


        firebaseApp.auth().onAuthStateChanged(async user => {
            if (user) {
                const snapshot = await doesUserExist();

                // When this is the first login for the user
                if (!Object.keys(snapshot.val()).includes(user.uid)) {
                    await createUserValue(user.uid);
                    await createDefaultRoom(user.uid);
                }

                this.props.actions.messages.signIn({
                    userId: user.uid,
                    userPhoto: "https://firebasestorage.googleapis.com/v0/b/react-chat-28bf1.appspot.com/o/images%2Fno-profile-icon.jpg?alt=media&token=056753ee-3755-4b4e-bff1-a8ef8b614a6b"
                })
            }
        })
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