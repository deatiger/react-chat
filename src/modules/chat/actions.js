import {createActions} from 'redux-actions';
import {database, firebaseApp, providerTwitter, storage} from '../../firebase/index'
import {getDatetimeAsNumber, updateMultiPath} from '../../functions/index'

export const actions = createActions({
    messages: {
        anonymousSignIn() {
            firebaseApp.auth().signInAnonymously()
                .then(() => { return true })
                .catch((error) => {
                    console.error(error);
                    return false
                })
        },
        addMember(selectedUsers, rooms) {
            if (selectedUsers.length === 0) {
                alert('メンバーを選択してください');
                return false
            }

            const roomId = rooms.id;
            const ownerId = rooms.ownerId;

            let userIds = rooms.userIds;
            for (let selectedUser of selectedUsers) {
                userIds.push(selectedUser)
            }

            let memberJson = {};
            for (let userId of userIds) {
                memberJson[userId] = ownerId
            }

            let updateJson = {};
            for (let memberId of userIds) {
                if (selectedUsers.includes(memberId)) {
                    const memberPath = `chatRoom/${memberId}/${roomId}`;
                    const datetime = getDatetimeAsNumber();
                    updateJson[memberPath] = {
                        room_icon: rooms.image,
                        owner_id: ownerId,
                        name: rooms.name,
                        updated_at: datetime,
                        updated_at_minus: -datetime,
                        user_ids: memberJson,
                    };
                } else {
                    const memberPath = `chatRoom/${memberId}/${roomId}/user_ids`;
                    updateJson[memberPath] = memberJson
                }
            }

            updateMultiPath(updateJson);
            return userIds
        },
        backToChat() {
            return true
        },
        backToRooms() {
            return true
        },
        change(value) {
            return value
        },
        configure() {
            return true
        },
        create(selectedUsers, userId, rooms, groupName, groupIcon) {
            if (selectedUsers.length === 0) {
                alert('メンバーを選択してください');
                return false
            }
            const chatRoomRef = database.ref('chatRoom');

            const currentTime = getDatetimeAsNumber();
            let roomJson = {
                owner_id: userId,
                updated_at: currentTime,
                updated_at_minus: -(currentTime),
            };
            let room = {};

            if (selectedUsers.length === 1) {
                // Verify the chat room with the same partner has already existed or not.
                for (let roomId of Object.keys(rooms)) {
                    if (rooms[roomId].userIds.includes(selectedUsers[0])) {
                        alert('すでに同じ相手とのチャットルームが存在しています。');
                        return false
                    }
                }

                try {
                    roomJson['user_ids'] = {
                        [userId]: userId,
                        [selectedUsers[0]]: userId,
                    };

                    const newRoom = chatRoomRef.child(userId).push(roomJson);
                    chatRoomRef.child(selectedUsers[0]).child(newRoom.key).update(roomJson);

                    alert('チャットルームを作成しました。')
                    return {partnerId: selectedUsers[0]};
                } catch (e) {
                    console.error(e)
                    alert('チャットルーム作成中にエラーが発生しました。通信環境を確認してください。');
                    return false
                }
            } else if (selectedUsers.length > 1) {
                try {
                    let updateJson = {};
                    // Add default
                    roomJson['name'] = "名称未設定";
                    roomJson['room_icon'] = "https://firebasestorage.googleapis.com/v0/b/react-chat-28bf1.appspot.com/o/images%2Fno-image-square.png?alt=media&token=03d04110-aab2-4c03-9779-2293f40bb463"

                    const newRoom = chatRoomRef.child(userId).push(roomJson);

                    // Add user IDs
                    roomJson['is_mute'] = false;
                    roomJson['user_ids'] = {[userId]: userId};

                    for (let selectedUser of selectedUsers) {
                        roomJson['user_ids'][selectedUser] = userId;
                    }

                    // Add room data to each user's room
                    for (let selectedUser of selectedUsers) {
                        const userRoomPath = `/chatRoom/${selectedUser}/${newRoom.key}`;
                        updateJson[userRoomPath] = roomJson
                    }

                    updateMultiPath(updateJson)
                    alert('チャットルームを作成しました。')

                    room = {
                        image: "https://firebasestorage.googleapis.com/v0/b/react-chat-28bf1.appspot.com/o/images%2Fno-image-square.png?alt=media&token=03d04110-aab2-4c03-9779-2293f40bb463",
                        name: "名称未設定",
                        id: newRoom.key,
                        msgs: [],
                        isMute: false,
                        ownerId: userId,
                        partnerId: "",
                        userIds: selectedUsers,
                    };

                    return {
                        room: room,
                        roomId: newRoom.key,
                        userIds: Object.keys(roomJson['user_ids'])
                    };
                } catch (e) {
                    console.error(e);
                    alert('チャットルーム作成中にエラーが発生しました。通信環境を確認してください。');
                    return false
                }
            }
        },
        delete(value) {
            const ret = window.confirm('チャットを削除しますか？\nチャットを削除すると、今までのやりとりを見ることができなくなります。この操作はやり直しができません。')
            if (!ret) {
                return false
            } else {
                let userIds = value.userIds;
                let deleteJson = {};

                for (let userId of userIds) {
                    const userRoomPath = `/chatRoom/${userId}/${value.roomId}`;
                    deleteJson[userRoomPath] = null
                }

                updateMultiPath(deleteJson);
                return value
            }
        },
        exit(value) {
            const ret = window.confirm('グループチャットから退出しますか？');

            if (!ret) {
                return false
            } else {
                const roomId = value.roomId;
                const userId = value.userId;
                let updateJson = {};

                // Delete chat room from the current user
                const myRoomPath = `/chatRoom/${userId}/${roomId}`;
                updateJson[myRoomPath] = null;

                // Remove the current user from the members of chat room.
                for (let memberId of value.userIds) {
                    if (memberId === userId) {
                        continue
                    }
                    const memberRoomPath = `/chatRoom/${memberId}/${roomId}/user_ids/${userId}`;
                    updateJson[memberRoomPath] = null
                }

                updateMultiPath(updateJson);
                return true
            }
        },
        kick(value, targetId) {
            const ret = window.confirm('このメンバーをグループから削除しますか？');

            if (!ret) {
                return false
            } else {
                const roomId = value.roomId;
                let updateJson = {};

                // Delete chat room from the current user
                const targetRoomPath = `/chatRoom/${targetId}/${roomId}`;
                updateJson[targetRoomPath] = null;

                // Remove the current user from the members of chat room.
                for (let memberId of value.userIds) {
                    if (memberId === targetId) {
                        continue
                    }
                    const memberRoomPath = `/chatRoom/${memberId}/${roomId}/user_ids/${targetId}`;
                    updateJson[memberRoomPath] = null
                }

                updateMultiPath(updateJson);
                return targetId
            }
        },
        inputGroupName(value) {
            return value;
        },
        signIn(value) {
            return value
        },
        signOut(value) {
            firebaseApp.auth().signOut();
            return value
        },
        mute(value) {
            const payload = !value.isMute;
            try {
                database.ref('chatRoom').child(value.userId).child(value.roomId).update({is_mute: payload})
            } catch (e) {
                console.error(e)
            }
            return payload
        },
        rename(storeState) {
            const ret = window.confirm('ルーム名を変更しますか？');
            if (!ret) {
                return false
            } else {
                const newName = storeState.roomName;
                const roomId = storeState.roomId;
                const userIds = storeState.userIds;
                let updateJson = {};

                for (let userId of userIds) {
                    const userRoomPath = `/chatRoom/${userId}/${roomId}/name`;
                    updateJson[userRoomPath] = newName
                }

                updateMultiPath(updateJson);
                return newName
            }
        },
        select(value, userId) {
            // Change isRead flag
            const targetRoom = database.ref('chatRoom').child(userId).child(value.id).child('messages');
            targetRoom.orderByChild('isRead').equalTo(false).on('child_added', (snapshot) => {
                targetRoom.child(snapshot.key).update({isRead: true});
            });
            return value
        },
        search(word, rooms) {
            let newRooms = {};

            if (word === "") {
                // Display all rooms
                newRooms = rooms
            } else {
                // If a message matched with inputted word, add it to newRooms
                const regex = new RegExp(`${word}`);
                for (let roomId of Object.keys(rooms)) {
                    for (let message of rooms[roomId]['msgs']) {
                        if (regex.test(message.text)) {
                            newRooms[roomId] = rooms[roomId];
                            break
                        }
                    }
                }
            }
            return newRooms
        },
        switch(boolean) {
            return !boolean
        },
        submit(value, roomId, fromId, toId, memberIds) {
            const payload = value;
            if (payload === '') {
                alert('メッセージを入力してください');
                return false;
            }

            const datetime = getDatetimeAsNumber();
            const messageJson = {
                from_id: fromId,
                isRead: false,
                message: payload,
                send_at: datetime,
                send_at_minus: -datetime
            };

            const newMessage = database.ref('chatRoom').child(fromId).child(roomId).child('messages').push(messageJson);
            const messagePath = `messages/${newMessage.key}`;

            for (let memberId of memberIds) {
                database.ref('chatRoom').child(memberId).child(roomId).update({
                    [messagePath]: messageJson,
                    updated_at: datetime,
                    updated_at_minus: -datetime
                });
            }

            return payload
        },
        twitterSignIn() {
            firebaseApp.auth().signInWithRedirect(providerTwitter);
            firebaseApp.auth().getRedirectResult().then(async (result) => {
                console.log("twitterSignIn() is successfully executed! ", result);
                return true
            })
        },
        upload(image, value) {
            const uploadRef = storage.ref('images').child(value.roomId);
            const uploadTask = uploadRef.put(image);
            uploadTask.on('state_changed', (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            }, (error) => {
                // Handle unsuccessful uploads
                console.error("Failed to upload file. ERROR: ", error);
            }, () => {
                // Handle successful uploads on complete
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    let updateJson = {};
                    for (let userId of value.userIds) {
                        const userRoomPath = `chatRoom/${userId}/${value.roomId}/room_icon`;
                        updateJson[userRoomPath] = downloadURL
                    }
                    updateMultiPath(updateJson);
                    return true
                });
            });
        }
    },
});
