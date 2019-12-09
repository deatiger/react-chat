import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from '@material-ui/icons/AddCircle';

const MemberList = (props) => {
    const useStyles = makeStyles(theme => ({
        nested: {
            paddingLeft: theme.spacing(4),
        },
    }));
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    // Get the owner id in this room.
    const ownerId = props.value.rooms[props.value.roomId].ownerId;

    return (
        <div>
            <ListItem button onClick={handleClick}>
                <ListItemText primary="グループメンバーを見る" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {(props.value.userIds).map((id, i) => (
                        <ListItem key={i} button className={classes.nested}>
                            <ListItemAvatar>
                                <Avatar alt="Icon" src={props.value.userValues[id].image}/>
                            </ListItemAvatar>
                            <ListItemText primary={props.value.userValues[id].name} />
                            {(id !== props.value.userId && id !== ownerId) && (
                            <IconButton
                                className="ml-auto"
                                edge="end"
                                color="inherit"
                                aria-label="setting"
                                onClick={() => props.kick(props.value, id)}>
                                <span className="u-text-smaller u-text-faded">•••</span>
                            </IconButton>
                            )}
                        </ListItem>
                    ))}
                    <ListItem key="add" button className={classes.nested}>
                        <ListItemText primary="メンバーを追加する" />
                        <IconButton
                            className="ml-auto"
                            edge="end"
                            color="inherit"
                            aria-label="setting"
                            onClick={() => props.edit()}>
                            <AddCircleIcon color="primary" />
                        </IconButton>
                    </ListItem>
                </List>
            </Collapse>
        </div>

    )
}

export default MemberList
