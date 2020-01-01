import React, {Component} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
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

        if (this.props.msgs.text) {
            this.text = this.props.msgs.text.split("\n").map((line, key) => <span key={key}>{line}<br/></span>);
        } else {
            this.text = ""
        }

        if (this.props.msgs.isMyMessage) {
            this.row = "p-chat__row-reverse";
        } else {
            this.row = "p-chat__row";
        }

    }

    render() {
        return (
            <List className={this.classes.root}>
                <ListItem className={this.row}>
                    <ListItemAvatar className="p-chat__icon">
                        <Avatar alt="Partner Icon" src={this.props.msgs.image}/>
                    </ListItemAvatar>
                    <ListItemText className="p-chat__box" primary={this.text}/>
                </ListItem>
            </List>
        )
    }
}

export default AlignItemsList;
