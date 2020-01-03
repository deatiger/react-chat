import produce from 'immer';

export const addMember = (state, payload) => {
    if (!payload) {
        // Cancel the action to add new members
        return produce(state, draftState => {});
    } else {
        const newState = produce(state, draftState => {
            draftState.userIds = payload
        });
        return newState;
    }
};

export const addMessage = (state, payload) => {
    const newState = produce(state, draftState => {
        draftState.value = '';
    });
    return newState;
};

export const backToChat = (state, payload) => {
    const newState = produce(state, draftState => {
        draftState.isConfigured = false;
    });
    return newState;
};

export const backToRooms = (state, payload) => {
    const newState = produce(state, draftState => {
        draftState.isMute = false;
        draftState.msgs = [];
        draftState.roomId = '';
        draftState.userIds = '';
    });
    return newState;
};

export const configureRoom = (state, payload) => {
    const newState = produce(state, draftState => {
        draftState.isConfigured = true;
        draftState.msgs = [];
    });
    return newState;
};

export const changeText = (state, payload) => {
    const newState = produce(state, draftState => {
        draftState.value = payload;
    });
    return newState;
};

export const createRoom = (state, payload) => {
    if (!payload) {
        return produce(state, draftState => {});
    } else {
        const newState = produce(state, draftState => {
            draftState.isCreatePage = false;
            draftState.isConfigured = true;
            draftState.msgs = [];
            draftState.rooms[payload.roomId] = payload.room;
            draftState.displayedRooms[payload.roomId] = payload.room;
            draftState.roomId = payload.roomId;
            draftState.userIds = payload.userIds;
        });
        return newState;
    }
};

export const deleteRoom = (state, payload) => {
    if (!payload) {
        return produce(state, draftState => {});
    } else {
        return window.location.reload()
    }
};

export const exitRoom = (state, payload) => {
    if (!payload) {
        return produce(state, draftState => {});
    } else {
        return window.location.reload()
    }
};

export const kickOut = (state, payload) => {
    const newUserIds = state.userIds.filter((userId) => userId !== payload);
    if (!payload) {
        return produce(state, draftState => {});
    } else {
        return produce(state, draftState => {
            draftState.userIds = newUserIds
        });
    }
};

export const inputGroupName = (state, payload) => {
    const newState = produce(state, draftState => {
        draftState.roomName = payload;
    });
    return newState;
};

export const mailSignIn = (state, payload) => {
    return produce(state, draftState => {});
};

export const mailSignUp= (state, payload) => {
    return produce(state, draftState => {});
};

export const renameGroup = (state, payload) => {
    if (!payload) {
        // Cancel the action to rename group
        return produce(state, draftState => {});
    } else {
        const newState = produce(state, draftState => {
            draftState.rooms[draftState.roomId].name = payload
            draftState.roomName = payload
        });
        return newState;
    }
};

export const searchMessage = (state, payload) => {
    const newState = produce(state, draftState => {
        draftState.displayedRooms = payload
    });
    return newState;
};

export const selectRoom = (state, payload) => {
    const newState = produce(state, draftState => {
        draftState.isMute = payload.isMute;
        draftState.msgs = [];
        draftState.roomId = payload.id;
        draftState.roomName = payload.name;
        draftState.userIds = payload.userIds;
    });
    return newState;
};

export const signIn = (state, payload) => {
    const newState = produce(state, draftState => {
        draftState.userId = payload.userId;
        draftState.userPhoto = payload.userPhoto;
    });
    return newState;
};

export const signOut = (state, payload) => {
    const newState = produce(state, draftState => {
        draftState.displayedRooms = {};
        draftState.isCreatePage = false;
        draftState.isConfigured = false;
        draftState.isMute = false;
        draftState.msgs = [];
        draftState.rooms = {};
        draftState.roomId = '';
        draftState.roomName = '';
        draftState.userId = '';
        draftState.userIds = '';
        draftState.userValues = {};
        draftState.userPhoto = '';
        draftState.value = '';
    });
    return newState;
};

export const switchList = (state, payload) => {
    const newState = produce(state, draftState => {
        draftState.isCreatePage = payload
    });
    return newState;
};

export const switchMute = (state, payload) => {
    const newState = produce(state, draftState => {
        draftState.isMute = payload
    });
    return newState;
};

export const twitterSignIn = (state, payload) => {
    return produce(state, draftState => {});
};

export const uploadIcon = (state, payload) => {
    return produce(state, draftState => {});
};