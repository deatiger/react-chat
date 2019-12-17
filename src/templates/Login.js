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

        const queryUserValue = async (id) => {
            return database.ref('users').child(id).once('value', (snapshot) => { return snapshot })
        };

        const createUserValue = async (user) => {
            console.log(user.photoURL);
            return database.ref('users').update({
                [user.uid]: {
                    name: user.displayName,
                    photoPath: (user.photoURL) ? user.photoURL.replace( "_normal", "" ) : "https://firebasestorage.googleapis.com/v0/b/react-chat-28bf1.appspot.com/o/images%2Fno-profile-icon.jpg?alt=media&token=056753ee-3755-4b4e-bff1-a8ef8b614a6b"
                }
            })
        };

        const createDefaultRoom = (userId) => {
            return new Promise((resolve, reject) => {
                const now = getDatetimeAsNumber();
                const businessAccountId = "JIZiG0O1cpfaO3EqFkRQLPeZL2H3";
                const chatAccountId = "cbaRWL7y0xR4VXoXxzpUnkFaoRv1";

                const businessTalk = {
                    name: "お仕事用チャット",
                    owner_id: businessAccountId,
                    updated_at: now,
                    updated_at_minus: -now,
                    user_ids: {
                        [businessAccountId]: businessAccountId,
                        [userId]: businessAccountId
                    },
                    messages: {
                        DEFAULTMESSAGES: {
                            from_id: businessAccountId,
                            isRead: false,
                            message: "お仕事の依頼はこちらのチャットでお願いします！\n匿名アカウントからの依頼は受け付けていません。",
                            send_at: now,
                            send_at_minus: -now
                        }
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
                    },
                    messages: {
                        DEFAULTMESSAGES: {
                            from_id: chatAccountId,
                            isRead: false,
                            message: "チャット機能を試してみたい人はここで雑談しましょう！\n匿名アカウントじゃなければ、トラハックが気が向いたら返信します。",
                            send_at: now,
                            send_at_minus: -now
                        }
                    }
                };

                const groupTalk = {
                    name: "グループチャット",
                    owner_id: userId,
                    room_icon: "https://firebasestorage.googleapis.com/v0/b/react-chat-28bf1.appspot.com/o/images%2Fno-image-square.png?alt=media&token=03d04110-aab2-4c03-9779-2293f40bb463",
                    updated_at: now,
                    updated_at_minus: -now,
                    user_ids: {
                        [userId]: userId,
                        [businessAccountId]: userId,
                        [chatAccountId]: userId
                    },
                    messages: {
                        DEFAULTMESSAGES: {
                            from_id: businessAccountId,
                            isRead: false,
                            message: "ここはあなたがオーナーのグループチャットです！\n右上の設定ボタンからグループの情報を変更してみてね。",
                            send_at: now,
                            send_at_minus: -now
                        }
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
                const userId = user.uid;
                let userPhoto;

                const users = await doesUserExist();

                // When this is the first login for the user
                if (!Object.keys(users.val()).includes(userId)) {
                    await createUserValue(user);
                    await createDefaultRoom(userId);
                    userPhoto = (user.photoURL) ? user.photoURL.replace( "_normal", "" ) : "https://firebasestorage.googleapis.com/v0/b/react-chat-28bf1.appspot.com/o/images%2Fno-profile-icon.jpg?alt=media&token=056753ee-3755-4b4e-bff1-a8ef8b614a6b"
                } else {
                    const snapshot = await queryUserValue(userId);
                    userPhoto = (snapshot.val().photoPath) ? snapshot.val().photoPath : "https://firebasestorage.googleapis.com/v0/b/react-chat-28bf1.appspot.com/o/images%2Fno-profile-icon.jpg?alt=media&token=056753ee-3755-4b4e-bff1-a8ef8b614a6b"
                }

                this.props.actions.messages.signIn({
                    userId: user.uid,
                    userPhoto: userPhoto,
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