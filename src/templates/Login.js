import React, {Component} from 'react';
import {Login} from '../components';
import {database, firebaseApp} from "../firebase";
import {getDatetimeAsNumber, updateMultiPath} from "../functions";

class LoginTemplate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            mail: "",
            password: "",
            isHidden: true
        };

        this.inputMail = (value) => {
            this.setState({
                mail: value
            })
        };

        this.inputName = (value) => {
            this.setState({
                name: value
            })
        };

        this.inputPassword = (value) => {
            this.setState({
                password: value
            })
        };

        this.toggleIsHidden = () => {
            this.setState({
                isHidden: !this.state.isHidden
            })
        }
    }

    async componentDidMount() {
        const doesUserExist = async () => {
            return database.ref('users').once('value', (snapshot) => { return snapshot })
        };

        const queryUserValue = async (id) => {
            return database.ref('users').child(id).once('value', (snapshot) => { return snapshot })
        };

        const createUserValue = async (user) => {

            return database.ref('users').update({
                [user.uid]: {
                    name: (user.displayName) ? user.displayName: this.state.name,
                    photoPath: (user.photoURL) ? user.photoURL.replace( "_normal", "" ) : "https://firebasestorage.googleapis.com/v0/b/react-chat-28bf1.appspot.com/o/images%2Fno-profile-icon.jpg?alt=media&token=056753ee-3755-4b4e-bff1-a8ef8b614a6b"
                }
            })
        };

        const createDefaultRoom = (user) => {
            return new Promise((resolve, reject) => {
                const now = getDatetimeAsNumber();
                const userId = user.uid;
                const userName = (user.displayName) ? user.displayName: this.state.name;
                const businessAccountId = "JIZiG0O1cpfaO3EqFkRQLPeZL2H3";
                const chatAccountId = "cbaRWL7y0xR4VXoXxzpUnkFaoRv1";

                const businessTalk = {
                    name: `${userName}さんのお仕事用チャット`,
                    owner_id: businessAccountId,
                    updated_at: now,
                    updated_at_minus: -now,
                    user_ids: {
                        [businessAccountId]: businessAccountId,
                        [userId]: businessAccountId
                    },
                    messages: {
                        "-DEFAULTMESSAGES": {
                            from_id: businessAccountId,
                            isRead: false,
                            message: "お仕事の依頼はこちらのチャットでお願いします！\n匿名でのご依頼は受け付けていません。",
                            send_at: now,
                            send_at_minus: -now
                        }
                    }
                };

                const smallTalk = {
                    name: `${userName}さんの雑談用チャット`,
                    owner_id: chatAccountId,
                    updated_at: now,
                    updated_at_minus: -now,
                    user_ids: {
                        [chatAccountId]: chatAccountId,
                        [userId]: chatAccountId
                    },
                    messages: {
                        "-DEFAULTMESSAGES": {
                            from_id: chatAccountId,
                            isRead: false,
                            message: "チャット機能を試してみたい人はここで雑談しよう！\n気が向いたら返信します。",
                            send_at: now,
                            send_at_minus: -now
                        }
                    }
                };

                const groupTalk = {
                    name: `${userName}さんのグループチャット`,
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
                        "-DEFAULTMESSAGES": {
                            from_id: businessAccountId,
                            isRead: false,
                            message: `ここは${userName}さんがオーナーのグループチャットです！\n右上の設定ボタンからグループの情報を変更してみてね。`,
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
                    await createDefaultRoom(user);
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
            <div className="p-box__login">
                <Login.TwitterLoginButton signIn={this.props.actions.messages.twitterSignIn}/>
                <Login.ToggleButton toggleIsHidden={this.toggleIsHidden} />
                {(!this.state.isHidden) && (
                    <div className="c-grid__column">
                        <Login.InputField value={this.state.name} input={this.inputName} label="名前" type="text" />
                        <Login.InputField value={this.state.mail} input={this.inputMail} label="メールアドレス" type="text" />
                        <Login.InputField value={this.state.password} input={this.inputPassword} label="パスワード" type="password" />
                        <div className="c-grid__row-wrap">
                            <Login.MailLoginButton
                                mail={this.state.mail}
                                password={this.state.password}
                                signIn={this.props.actions.messages.mailSignIn}
                            />
                            <Login.MailSignUpButton
                                mail={this.state.mail}
                                password={this.state.password}
                                signUp={this.props.actions.messages.mailSignUp}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default LoginTemplate