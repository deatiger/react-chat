import React, {Component} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';

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
    }

    render() {
        return (
            <List className={this.classes.root}>
                <ListItem className="px-2" id={this.props.rooms.id} onClick={() => this.props.onClick(this.props.rooms, this.props.userId)}>
                    <ListItemAvatar>
                        <Avatar alt="Icon" src={this.props.rooms.image}/>
                    </ListItemAvatar>
                    <ListItemText primary={this.props.rooms.name} />
                    {(this.props.rooms.hasNotRead > 0) && (
                        <label className="p-badge-orange">{this.props.rooms.hasNotRead}</label>
                    )}
                </ListItem>
                <Divider variant="inset" component="li" />
            </List>
        )
    }
}

export default AlignItemsList;