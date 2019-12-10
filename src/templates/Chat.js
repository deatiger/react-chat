import React, {Component, Suspense} from 'react';
import {Chat} from '../components/core';
import * as Common from "../components/core/Common";
import {database} from '../firebase/index'

class ChatTemplate extends Component {
    constructor(props) {
        super(props);
        this.chatMemberRef = database.ref('chatRoomMember');
        this.userRef = database.ref('users');

        this.setMessageListener = async () => {
            const queryUserPhoto = (id) => {
                return new Promise(resolve => {
                    return this.userRef.child(id).once('value', (snapshot) => {
                        const userValue = snapshot.val();
                        const userPhoto = (userValue.photoPath) ? userValue.photoPath : "https://firebasestorage.googleapis.com/v0/b/energeia-ad20f.appspot.com/o/images%2Fsrc%2Ficon_prof.png?alt=media&token=12803b38-3ab9-467b-9215-e3c19d6c34fa"
                        return resolve(userPhoto)
                    })
                })
            };

            // Add icons for each member in the group or private chat
            const memberIds = this.props.messages.userIds;
            const partnerId = this.props.messages.partnerId;
            let photoList = {};
            if (memberIds !== "") {
                for (let memberId of Object.keys(memberIds)) {
                    photoList[memberIds[memberId]] = await queryUserPhoto(memberIds[memberId])
                }
            } else {
                photoList[this.props.messages.userId] = this.props.messages.userPhoto;
                photoList[partnerId] = await queryUserPhoto(partnerId)
            }

            let msgs = this.props.messages.msgs;
            this.chatMemberRef.child(this.props.messages.userId).child(this.props.messages.roomId).child('messages').on('child_added', snapshot => {
                const message = snapshot.val();
                if (message.from_id) {
                    const isMyMessage = (message.from_id === this.props.messages.userId);
                    msgs.push({
                        image: (photoList[message.from_id]) ? photoList[message.from_id] : "https://firebasestorage.googleapis.com/v0/b/energeia-ad20f.appspot.com/o/images%2Fsrc%2Ficon_prof.png?alt=media&token=12803b38-3ab9-467b-9215-e3c19d6c34fa",
                        isMyMessage: isMyMessage,
                        text: message.message
                    });
                }
                this.setState({
                    msgs: msgs,
                });
            });

        };

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
        // Set listener to fetch message data
        if (!this.props.messages.isListenerSet) {
            this.setMessageListener();
            this.props.actions.messages.listen(true)
        }

        return (
            <React.Fragment>
                {(this.props.messages.roomId === "") ? (
                    <div className="p-chat">
                        <div className="p-chat__area" id="scroll-area">
                        </div>
                    </div>
                ) : (
                <div className="p-chat">
                    <Common.NavBar value={this.props.messages}
                                   back={this.props.actions.messages.backToRooms}
                                   configure={this.props.actions.messages.configure}/>
                    <div className="p-chat__area" id="scroll-area">
                        {this.props.messages.msgs.map((m, i) => (
                            <Chat.AlignItemsList key={i} msgs={m} />
                        ))}
                    </div>
                    <div className="c-grid__row">
                        <Chat.TextInput
                            onChange={this.props.actions.messages.change}
                            value={this.props.messages.value}
                        />
                        <Chat.SendButton
                            onClick={this.props.actions.messages.submit}
                            value={this.props.messages.value}
                            roomId={this.props.messages.roomId}
                            fromId={this.props.messages.userId}
                            toId={this.props.messages.partnerId}
                            userIds={this.props.messages.userIds}
                        />
                    </div>
                </div>
                )}
            </React.Fragment>
        );
    }
}

export default ChatTemplate