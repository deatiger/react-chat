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
                    const memberPath = `chatRoomMember/${memberId}/${roomId}`;
                    const datetime = getDatetimeAsNumber();
                    updateJson[memberPath] = {
                        group_icon: rooms.image,
                        made_room_user_id: ownerId,
                        name: rooms.name,
                        room_id: roomId,
                        updated_at: datetime,
                        updated_at_minus: -datetime,
                        user_ids: memberJson,
                    };
                } else {
                    const memberPath = `chatRoomMember/${memberId}/${roomId}/user_ids`;
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
            const payload = value;
            return payload;
        },
        configure() {
            return true
        },
        create(selectedUsers, userId, rooms, groupName, groupIcon) {
            if (selectedUsers.length === 0) {
                alert('メンバーを選択してください');
                return false
            }
            const chatMemberRef = database.ref('chatRoomMember');
            const chatRoomRef = database.ref('chatRooms');

            const currentTime = getDatetimeAsNumber();
            let roomJson = {
                made_room_user_id: userId,
                update_at: currentTime,
                update_at_minus: -(currentTime),
            };
            let newRoomId = "";
            let room = {};

            if (selectedUsers.length === 1) {
                // Verify the chat room with the same partner has already existed or not.
                for (let roomId of Object.keys(rooms)) {
                    if (rooms[roomId].partnerId === selectedUsers[0]) {
                        alert('すでに同じ相手とのチャットルームが存在しています。');
                        return false
                    }
                }

                try {
                    roomJson['partner_id'] = selectedUsers[0];
                    const newRoomRef = chatMemberRef.child(userId).push(roomJson);
                    newRoomId = newRoomRef.key;
                    roomJson['room_id'] = newRoomId

                    // Update again to add "room_id" field
                    chatMemberRef.child(userId).child(newRoomId).update(roomJson);

                    // Update partner chat room
                    roomJson['partner_id'] = userId;
                    chatMemberRef.child(selectedUsers[0]).child(newRoomId).update(roomJson);

                    // Create chat room
                    chatRoomRef.child(newRoomId).update({is_mute: false});
                    alert('チャットルームを作成しました。')
                    return {partnerId: selectedUsers[0]};
                } catch (e) {
                    console.error(e)
                    alert('チャットルーム作成中にエラーが発生しました。通信環境を確認してください。');
                    return false
                }
            } else if (selectedUsers.length > 1) {
                try {
                    // Add default
                    roomJson['name'] = (groupName) ? groupName : "名称未設定";
                    roomJson['group_icon'] = (groupIcon) ? groupIcon : "https://firebasestorage.googleapis.com/v0/b/energeia-ad20f.appspot.com/o/images%2Fsrc%2Fico_default_profile.png?alt=media&token=a194e129-bc4b-4820-b367-cb892232beb8"

                    const newRoomRef = chatRoomRef.push(roomJson);
                    newRoomId = newRoomRef.key;
                    roomJson['room_id'] = newRoomId;
                    const roomPath = `/chatRooms/${newRoomId}/room_id`;
                    let updateJson = {[roomPath]: newRoomId};

                    // Add user IDs
                    roomJson['is_mute'] = false;
                    roomJson['user_ids'] = {};
                    selectedUsers.push(userId);

                    for (let selectedUser of selectedUsers) {
                        roomJson['user_ids'][selectedUser] = userId;
                    }

                    // Add room data to each user's room
                    for (let selectedUser of selectedUsers) {
                        const userRoomPath = `/chatRoomMember/${selectedUser}/${newRoomId}`;
                        updateJson[userRoomPath] = roomJson
                    }

                    room = {
                        image: (groupIcon) ? groupIcon : "https://firebasestorage.googleapis.com/v0/b/energeia-ad20f.appspot.com/o/images%2Fsrc%2Fico_default_profile.png?alt=media&token=a194e129-bc4b-4820-b367-cb892232beb8",
                        name: (groupName) ? groupName : "名称未設定",
                        id: newRoomId,
                        msgs: [],
                        isMute: false,
                        ownerId: userId,
                        partnerId: "",
                        userIds: selectedUsers,
                    };

                    updateMultiPath(updateJson)
                    alert('チャットルームを作成しました。')
                    return {
                        room: room,
                        roomId: newRoomId,
                        partnerId: (selectedUsers.length === 1) ? selectedUsers[0] : "",
                        userIds: (selectedUsers.length > 1) ? selectedUsers : "",
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
                let userIds = [];
                if (value.partnerId !== '') {
                    userIds.push(value.userId)
                    userIds.push(value.partnerId)
                } else {
                    userIds = value.userIds
                }

                const roomPath = `/chatRooms/${value.roomId}`;
                let deleteJson = {[roomPath]: null};

                for (let userId of userIds) {
                    const userRoomPath = `/chatRoomMember/${userId}/${value.roomId}`;
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

                if (value.userIds.length === 1) {
                    // Delete chat room by itself
                    const chatRoomPath = `/chatRooms/${roomId}`;
                    const myRoomPath = `/chatRoomMember/${userId}/${roomId}`;
                    updateJson[chatRoomPath] = null;
                    updateJson[myRoomPath] = null;
                } else {
                    // Delete chat room from the current user
                    const chatRoomPath = `/chatRooms/${roomId}/user_ids/${userId}`;
                    const myRoomPath = `/chatRoomMember/${userId}/${roomId}`;
                    updateJson[chatRoomPath] = null;
                    updateJson[myRoomPath] = null;

                    // Remove the current user from the members of chat room.
                    for (let memberId of value.userIds) {
                        if (memberId === userId) {
                            continue
                        }
                        const memberRoomPath = `/chatRoomMember/${memberId}/${roomId}/user_ids/${userId}`;
                        updateJson[memberRoomPath] = null
                    }
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
                const chatRoomPath = `/chatRooms/${roomId}/user_ids/${targetId}`;
                const targetRoomPath = `/chatRoomMember/${targetId}/${roomId}`;
                updateJson[chatRoomPath] = null;
                updateJson[targetRoomPath] = null;

                // Remove the current user from the members of chat room.
                for (let memberId of value.userIds) {
                    if (memberId === targetId) {
                        continue
                    }
                    const memberRoomPath = `/chatRoomMember/${memberId}/${roomId}/user_ids/${targetId}`;
                    updateJson[memberRoomPath] = null
                }

                updateMultiPath(updateJson);
                return targetId
            }
        },
        inputGroupName(value) {
            return value;
        },
        listen(value) {
            const payload = value;
            return payload
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
                database.ref('chatRoomMember').child(value.userId).child(value.roomId).update({is_mute: payload})
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
                const roomPath = `/chatRooms/${roomId}/name`
                let updateJson = {[roomPath]: newName};

                let userIds = [];
                if (storeState.partnerId !== '') {
                    userIds.push(storeState.userId)
                    userIds.push(storeState.partnerId)
                } else {
                    userIds = storeState.userIds
                }

                for (let userId of userIds) {
                    const userRoomPath = `/chatRoomMember/${userId}/${roomId}/name`;
                    updateJson[userRoomPath] = newName
                }

                updateMultiPath(updateJson);
                return newName
            }
        },
        select(value, userId) {
            // Change isRead flag
            const targetRoom = database.ref('/chatRoomMember').child(userId).child(value.id).child('messages');
            targetRoom.orderByChild('isRead').equalTo(false).on('child_added', (snapshot) => {
                targetRoom.child(snapshot.key).update({isRead: true});
            });
            const payload = value;
            return payload
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
            const payload = !boolean;
            return payload
        },
        submit(value, roomId, fromId, toId, memberIds) {
            const payload = value;
            if (payload === '') {
                alert('メッセージを入力してください');
                return false;
            }

            const isPrivate = (toId !== "" && memberIds === "");
            const datetime = getDatetimeAsNumber();
            const messageJson = {
                from_id: fromId,
                isRead: false,
                message: payload,
                send_at: datetime,
                send_at_minutes: -datetime
            };

            if (isPrivate) {
                messageJson['to_id'] = toId
            }

            const pushRef = database.ref('chatRooms').child(roomId).push(messageJson);
            const messagePath = `messages/${pushRef.key}`;

            if (isPrivate) {
                database.ref('chatRoomMember').child(`${fromId}/${roomId}`).update({
                    [messagePath]: messageJson,
                    update_at: datetime,
                    update_at_minus: -datetime
                });
                database.ref('chatRoomMember').child(`${toId}/${roomId}`).update({
                    [messagePath]: messageJson,
                    update_at: datetime,
                    update_at_minus: -datetime
                });
            } else {
                for (let memberId of memberIds) {
                    database.ref('chatRoomMember').child(`${memberId}/${roomId}`).update({
                        [messagePath]: messageJson,
                        update_at: datetime,
                        update_at_minus: -datetime
                    });
                }
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
                    const roomPath = `chatRooms/${value.roomId}/group_icon`;
                    let updateJson = {[roomPath]: downloadURL};
                    for (let userId of value.userIds) {
                        const userRoomPath = `chatRoomMember/${userId}/${value.roomId}/group_icon`
                        updateJson[userRoomPath] = downloadURL
                    }
                    updateMultiPath(updateJson);
                    return true
                });
            });
        }
    },
});
