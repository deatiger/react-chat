import React, {Component} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
}));

const UserCheckList = (props) => {
    const classes = useStyles();

    const handleToggle = (id, users) => {

        // Has Already checked
        if (users.includes(id)) {
            props.selectUser(id, 'REM');
        } else {
            props.selectUser(id, 'ADD');
        }
    };

    return (
        <List className={classes.root}>
            <ListItem key={props.key} role={undefined} dense button onClick={() => {handleToggle(props.user.id, props.users)}}>
                <ListItemAvatar>
                    <Avatar alt="Icon" src={props.user.image}/>
                </ListItemAvatar>
                <ListItemText primary={props.user.name} />
                <ListItemIcon>
                    <Checkbox
                        color="primary"
                        edge="end"
                        checked={props.users.includes(props.user.id)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': props.user.id }}
                    />
                </ListItemIcon>
            </ListItem>
            <Divider variant="inset" component="li" />
        </List>
    )
};

export default UserCheckList;