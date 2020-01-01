import React, {Component} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import {Configuration} from '../../components';
import IconButton from '@material-ui/core/IconButton';

class AlignItemsList extends Component {
    constructor(props) {
        super(props);
        this.classes = makeStyles(theme => ({
            root: {
                backgroundColor: theme.palette.background.paper,
            },
            inline: {
                display: 'inline',
            },
        }));

        this.state = {
            isEditingName: false,
            isEditingIcon: false,
        };
    }

    render() {
        const isOwner = (this.props.rooms.ownerId === this.props.value.userId);
        const isGroupChat = (this.props.rooms.userIds.length > 1);
        return (
            <List className={this.classes.root}>
                {(isGroupChat && isOwner) ? (
                    <div>
                        <div className="p-icon-big mx-auto">
                            <label htmlFor="room-icon">
                                <input className="u-display-none" type="file" id="room-icon" onChange={(e) => {
                                    this.props.upload(e.target.files[0], this.props.value)
                                }}/>
                                <img alt="Icon" src={this.props.rooms.image}/>
                            </label>
                        </div>
                        <ListItem className="px-2">
                            <Configuration.NameInput name={this.props.value.roomName} onChange={this.props.input}/>
                            <IconButton edge="end" onClick={() => this.props.rename(this.props.value)}>
                                <span className="u-text-smaller">OK</span>
                            </IconButton>
                        </ListItem>
                    </div>
                ) : (
                    <div>
                        <div className="p-icon-big mx-auto">
                            <img alt="Icon" src={this.props.rooms.image}/>
                        </div>
                        <ListItem className="px-2">
                            <ListItemText className="p-chat__config__name" primary={this.props.rooms.name} />
                        </ListItem>
                    </div>
                )}
                <Divider />
                <Configuration.MuteListItem value={this.props.value} switch={this.props.switch} />
                <Divider />
                {(this.props.value.userIds !== "") && (
                    <div>
                        <Configuration.MemberList value={this.props.value} kick={this.props.kick} edit={this.props.edit}/>
                        <Divider />
                        <Configuration.ExitRoom value={this.props.value} exit={this.props.exit}/>
                        <Divider />
                    </div>
                )}
                {(isOwner || this.props.value.userIds === "") && (
                    <div>
                        <Configuration.DeleteChat value={this.props.value} delete={this.props.delete}/>
                        <Divider />
                    </div>
                )}
            </List>
        )
    }
}

export default AlignItemsList;