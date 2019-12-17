import {handleActions} from 'redux-actions';
import {actions} from './index';
import {repos} from './index';
import {initialState} from '../store/initialState';
import {combineReducers} from 'redux';

const messages = handleActions(
    {
        [`${actions.messages.addMember}`](state, action) {
        return repos.messages.addMember(state, action.payload);
        },
        [`${actions.messages.submit}`](state, action) {
        return repos.messages.addMessage(state, action.payload);
        },
        [`${actions.messages.backToChat}`](state, action) {
            return repos.messages.backToChat(state, action.payload);
        },
        [`${actions.messages.backToRooms}`](state, action) {
            return repos.messages.backToRooms(state, action.payload);
        },
        [`${actions.messages.create}`](state, action) {
            return repos.messages.createRoom(state, action.payload);
        },
        [`${actions.messages.change}`](state, action) {
            return repos.messages.changeText(state, action.payload);
        },
        [`${actions.messages.configure}`](state, action) {
            return repos.messages.configureRoom(state, action.payload);
        },
        [`${actions.messages.delete}`](state, action) {
            return repos.messages.deleteRoom(state, action.payload);
        },
        [`${actions.messages.exit}`](state, action) {
            return repos.messages.exitRoom(state, action.payload);
        },
        [`${actions.messages.kick}`](state, action) {
            return repos.messages.kickOut(state, action.payload);
        },
        [`${actions.messages.inputGroupName}`](state, action) {
            return repos.messages.inputGroupName(state, action.payload);
        },
        [`${actions.messages.mailSignIn}`](state, action) {
            return repos.messages.mailSignIn(state, action.payload);
        },
        [`${actions.messages.mailSignUp}`](state, action) {
            return repos.messages.mailSignUp(state, action.payload);
        },
        [`${actions.messages.rename}`](state, action) {
            return repos.messages.renameGroup(state, action.payload);
        },
        [`${actions.messages.search}`](state, action) {
            return repos.messages.searchMessage(state, action.payload);
        },
        [`${actions.messages.select}`](state, action) {
            return repos.messages.selectRoom(state, action.payload);
        },
        [`${actions.messages.signIn}`](state, action) {
            return repos.messages.signIn(state, action.payload);
        },
        [`${actions.messages.signOut}`](state, action) {
            return repos.messages.signOut(state, action.payload);
        },
        [`${actions.messages.switch}`](state, action) {
            return repos.messages.switchList(state, action.payload);
        },
        [`${actions.messages.twitterSignIn}`](state, action) {
            return repos.messages.twitterSignIn(state, action.payload);
        },
        [`${actions.messages.mute}`](state, action) {
            return repos.messages.switchMute(state, action.payload);
        },
        [`${actions.messages.upload}`](state, action) {
            return repos.messages.uploadIcon(state, action.payload);
        },
    },
    initialState
);

export const createRootReducer = () => combineReducers({
    messages,
});