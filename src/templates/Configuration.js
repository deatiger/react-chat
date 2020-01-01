import React, {Component} from 'react';
import {Configuration} from '../components';
import {SendTo} from '../components';
import {Common} from '../components';
import {database} from '../firebase/index'

class ConfigurationTemplate extends Component {
    constructor(props) {
        super(props);
        this.userValue = "";

        this.state = {
            rooms: this.props.messages.rooms,
            displayedRooms: this.props.messages.displayedRooms,
            isMemberEdited: false,
            displayedUsers: [],
            selectedUsers: [],
        };

        this.toggleIsMemberEdited = () => {
            this.setState({
                selectedUsers: [],
                isMemberEdited: !this.state.isMemberEdited
            })
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
        const queryUserValue = (id) => {
            return new Promise(resolve => {
                return database.ref('users').child(id).once('value', (snapshot) => {
                    return resolve(snapshot.val())
                })
            })
        };

        this.userValue = await queryUserValue(this.props.messages.userId)

        const changeRooms = async (snapshot, type) => {
            const roomId = snapshot.key;
            const roomValue = snapshot.val();
            const isPrivate = (!roomValue.name);

            let roomName = "",
                roomIcon = "";

            if (isPrivate) {
                const partnerValue = await queryUserValue(roomValue.partner_id);
                roomName = partnerValue.name;
                roomIcon = (partnerValue.photoPath) ? partnerValue.photoPath : "https://firebasestorage.googleapis.com/v0/b/energeia-ad20f.appspot.com/o/images%2Fsrc%2Ficon_prof.png?alt=media&token=12803b38-3ab9-467b-9215-e3c19d6c34fa"
            } else {
                roomName = roomValue.name;
                roomIcon = roomValue.group_icon;
            }

            // Add message data to each room
            let msgs = [];
            if (roomValue.messages) {
                for (let messageKey of Object.keys(roomValue.messages)) {
                    const messageValue = roomValue.messages[messageKey];
                    msgs.push({
                        text: messageValue.message
                    });
                }
            }

            let rooms = this.props.messages.rooms;
            let displayedRooms = this.props.messages.displayedRooms;
            let isMute = false;
            if (roomValue.is_mute) {
                isMute = true
            }
            const roomJson = {
                image: roomIcon,
                name: roomName,
                id: roomId,
                msgs: msgs,
                isMute: isMute,
                ownerId: (roomValue.owner_id) ? roomValue.owner_id : "",
                partnerId: (isPrivate) ? roomValue.partner_id : "",
                userIds: (isPrivate) ? "" : Object.keys(roomValue.user_ids),
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
                })
            }
        };

        database.ref('chatRoom').child(this.props.messages.userId).orderByChild('update_at_minus').on('child_changed', async (snapshot) => {
            changeRooms(snapshot, "CHANGE")
        });

        database.ref('users').orderByKey().on('child_added', async (snapshot) => {
            const userId = snapshot.key;
            const userValue = snapshot.val();
            const userJson = {
                id: userId,
                name: userValue.name,
                image: (userValue.photoPath) ? userValue.photoPath : "https://firebasestorage.googleapis.com/v0/b/energeia-ad20f.appspot.com/o/images%2Fsrc%2Ficon_prof.png?alt=media&token=12803b38-3ab9-467b-9215-e3c19d6c34fa",
            };

            let displayedUsers = this.state.displayedUsers;
            displayedUsers.push(userJson);

            this.setState({
                displayedUsers: displayedUsers,
            })
        })
    }

    componentWillUnmount() {
        database.ref('chatRoom').child(this.props.messages.userId).off()
        return database.ref('users').orderByKey().off()
    }

    render() {
        return (
            <React.Fragment>
                {(this.state.isMemberEdited) ? (
                    <div className="p-chat">
                        <Configuration.SearchAppBar
                            users={Object.values(this.props.messages.userValues)}
                            value={this.props.messages}
                            isUserListHeader={this.state.isMemberEdited}
                            search={this.searchUser}
                            back={this.toggleIsMemberEdited}
                            userId={this.props.messages.userId}
                            selectedUsers={this.state.selectedUsers}
                            addMember={this.props.actions.messages.addMember}
                            signOut={this.props.actions.messages.signOut}
                        />
                        <div className="p-chat__area-list">
                            {this.state.displayedUsers.map((m, i) => (
                                <SendTo.UserCheckList key={i} user={m} users={this.state.selectedUsers} selectUser={this.selectUser} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-chat">
                        <Common.NavBar
                            value={this.props.messages}
                            back={this.props.actions.messages.backToChat}
                        />
                        <div className="p-chat__area-list">
                            {(Object.keys(this.props.messages.userValues).length > 0) && (
                                <Configuration.AlignItemsList
                                    value={this.props.messages}
                                    rooms={this.props.messages.rooms[this.props.messages.roomId]}
                                    switch={this.props.actions.messages.mute}
                                    input={this.props.actions.messages.inputGroupName}
                                    delete={this.props.actions.messages.delete}
                                    rename={this.props.actions.messages.rename}
                                    upload={this.props.actions.messages.upload}
                                    kick={this.props.actions.messages.kick}
                                    exit={this.props.actions.messages.exit}
                                    edit={this.toggleIsMemberEdited}
                                />
                            )}
                        </div>
                    </div>
                )}
            </React.Fragment>
        )
    }
}

export default ConfigurationTemplate