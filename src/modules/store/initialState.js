export const initialState = {
    value: '',
    userId: '',
    userPhoto: "https://firebasestorage.googleapis.com/v0/b/react-chat-28bf1.appspot.com/o/images%2FFAVPNG_user-profile-user-interface_NsQdunae.png?alt=media&token=2e32f1c5-d0bf-4260-88d4-c8611a808bc4",
    roomId: '',
    rooms: {},
    roomName: '',
    displayedRooms: {},
    displayedUsers : [], // [...userId]fs
    userValues: {}, // {key: userId, value: {userId, image, name}}
    msgs: [],
    isCreatePage: false,
    isConfigured: false,
    isMute: false,
    userIds: '',
};
