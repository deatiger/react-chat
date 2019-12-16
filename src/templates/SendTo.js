import React, {Component} from 'react';
import {SendTo} from '../components/core';
import {database} from '../firebase/index'

class SendTemplate extends Component {
    constructor(props) {
        super(props);
        this.chatMemberRef = database.ref('chatRoom');
        this.userRef = database.ref('users');
        this.specifiedUserId = window.location.search.split('?partnerId=')[1];

        this.state = {
            displayedUsers: [],
            selectedUsers: [],
        };

        this.selectUser = (user, type) => {
            let users = this.state.selectedUsers;

            switch (type) {
                case 'ADD':
                    users.push(user);
                    break;
                case 'REM':
                    users = users.filter(prevUser => prevUser !== user);
                    break;
            }

            this.setState({
                selectedUsers: users
            })
        };

        this.resetUser = () => {
            this.setState({
                selectedUsers: []
            })
        };

        this.searchUser = (word, users) => {
            let displayedUsers = [];

            if (word === "") {
                // Display all rooms
                displayedUsers = users
            } else {
                // If a message matched with inputted word, add it to newRooms
                const regex = new RegExp(`${word}`);
                for (let user of users) {
                    if (regex.test(user.name)) {
                        displayedUsers.push(user);
                    }
                }
            }
            this.setState({
                displayedUsers: displayedUsers
            })
        };

    }

    async componentDidMount() {
        const queryUserPhoto = (id) => {
            return new Promise(resolve => {
                return this.userRef.child(id).once('value', (snapshot) => {
                    const userPhoto = (snapshot.val().photoPath) ? snapshot.val().photoPath : "https://firebasestorage.googleapis.com/v0/b/react-chat-28bf1.appspot.com/o/images%2Fno-profile-icon.jpg?alt=media&token=056753ee-3755-4b4e-bff1-a8ef8b614a6b"
                    return resolve(userPhoto)
                })
            })
        };

        const changeRooms = async (snapshot, type) => {
            const roomId = snapshot.key,
                roomValue = snapshot.val(),
                roomName = (roomValue.name) ? roomValue.name : "",
                userIds = Object.keys(roomValue.user_ids);

            let rooms = this.props.messages.rooms,
                displayedRooms = this.props.messages.displayedRooms,
                isMute = false,
                msgs = [],
                hasNotRead = 0,
                icon = (roomValue.room_icon) ? roomValue.room_icon : "https://firebasestorage.googleapis.com/v0/b/react-chat-28bf1.appspot.com/o/images%2Fno-image-square.png?alt=media&token=03d04110-aab2-4c03-9779-2293f40bb463";

            if (userIds.length === 2) {
                for (let userId of userIds) {
                    if (userId === this.props.messages.userId) continue;
                    icon = await queryUserPhoto(userId)
                }
            }

            // Add message data to each room
            if (roomValue.messages) {
                for (let messageKey of Object.keys(roomValue.messages)) {
                    const messageValue = roomValue.messages[messageKey];
                    msgs.push({
                        text: messageValue.message
                    });
                    if (!messageValue.isRead) {
                        hasNotRead++
                    }
                }
            }

            if (roomValue.is_mute) {
                isMute = true
            }

            const roomJson = {
                image: icon,
                name: roomName,
                hasNotRead: hasNotRead,
                id: roomId,
                msgs: msgs,
                isMute: isMute,
                ownerId: roomValue.owner_id,
                userIds: Object.keys(roomValue.user_ids),
            };

            if (type === "ADD") {
                rooms[roomId] = roomJson;
                displayedRooms[roomId] = roomJson;

                this.setState({
                    rooms: rooms,
                    displayedRooms: displayedRooms,
                });

            } else if (type === "CHANGE") {
                const newRooms = this.state.rooms;
                const newDisplayedRooms = this.state.displayedRooms;
                newRooms[roomId] = roomJson;
                newDisplayedRooms[roomId] = roomJson;
                this.setState({
                    rooms: newRooms,
                    displayedRooms: newDisplayedRooms,
                });
            } else if (type === "DELETE" && this.props.messages.roomId === roomId) {
                alert('管理者によってグループチャットから削除されました。')
                return window.location.replace('/message')
            }
        };


        this.chatMemberRef.child(this.props.messages.userId).orderByChild('update_at_minus').on('child_added', async (snapshot) => {
            changeRooms(snapshot, "ADD")
        });

        this.chatMemberRef.child(this.props.messages.userId).orderByChild('update_at_minus').on('child_changed', async (snapshot) => {
            changeRooms(snapshot, "CHANGE")
        });

        this.chatMemberRef.child(this.props.messages.userId).orderByChild('update_at_minus').on('child_removed', async (snapshot) => {
            changeRooms(snapshot, "DELETE")
        });

        this.userRef.orderByKey().on('child_added', async (snapshot) => {
            const userId = snapshot.key;
            const userValue = snapshot.val();
            const userJson = {
                id: userId,
                name: userValue.name,
                image: (userValue.photoPath) ? userValue.photoPath : "https://firebasestorage.googleapis.com/v0/b/react-chat-28bf1.appspot.com/o/images%2Fno-profile-icon.jpg?alt=media&token=056753ee-3755-4b4e-bff1-a8ef8b614a6b",
            };

            let userValues = this.props.messages.userValues;
            let displayedUsers = this.props.messages.displayedUsers;
            userValues[userId] = userJson;
            displayedUsers.push(userJson);

            this.setState({
                userValues: userValues,
                displayedUsers: displayedUsers,
            })
        })
    }

    componentWillUnmount() {
        this.chatMemberRef.child(this.props.messages.userId).off();
        return this.userRef.orderByKey().off();
    }

    render() {
        return (
            <React.Fragment>
                {(this.props.messages.isCreatePage) ? (
                    <div className="p-chat">
                        <SendTo.SearchAppBar
                            value={Object.values(this.props.messages.userValues)}
                            rooms={this.props.messages.rooms}
                            isUserListHeader={this.props.messages.isCreatePage}
                            searchFunc={this.searchUser}
                            userId={this.props.messages.userId}
                            selectedUsers={this.state.selectedUsers}
                            createRoom={this.props.actions.messages.create}
                            switchList={this.props.actions.messages.switch}
                            signOut={this.props.actions.messages.signOut}
                        />
                        <div className="p-chat__area__list">
                            {(this.state.displayedUsers.length === 0) ? (
                                <SendTo.Loading />
                            ) : (
                                this.state.displayedUsers.map((m, i) => (
                                    <SendTo.UserCheckList key={i} user={m} users={this.state.selectedUsers} selectUser={this.selectUser} />
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-chat">
                        <SendTo.SearchAppBar
                            value={this.props.messages.rooms}
                            isUserListHeader={this.props.messages.isCreatePage}
                            searchFunc={this.props.actions.messages.search}
                            switchList={this.props.actions.messages.switch}
                            signOut={this.props.actions.messages.signOut}
                        />
                        <div className="p-chat__area__list">
                            {(this.props.messages.rooms.length === 0) ? (
                                <SendTo.Loading />
                            ) : (
                                Object.keys(this.props.messages.displayedRooms).map((m, i) => (
                                   <SendTo.AlignItemsList
                                       key={i}
                                       rooms={this.props.messages.displayedRooms[m]}
                                       userId={this.props.messages.userId}
                                       onClick={this.props.actions.messages.select} />
                                ))
                            )}
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

export default SendTemplate