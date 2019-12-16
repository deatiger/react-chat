import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import KeyboardBackspaceSharp from '@material-ui/icons/KeyboardBackspaceSharp';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {makeStyles} from "@material-ui/core";

const classes = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    bar: {
        paddingLeft: 14,
        paddingRight: 14,
    },
    blank: {
        position: 'relative',
        flexGrow: 1,
        width: "100%",
        marginLeft: 0,
    }
}));

const NavBar = (props) => {
    return (
        <div className={classes.root}>
        <AppBar position="static" color="secondary">
            <Toolbar className={classes.bar}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="back"
                    onClick={() => {props.back()}} >
                    <KeyboardBackspaceSharp />
                </IconButton>
                <div className={classes.blank} />
                <IconButton
                    className="u-margin__right"
                    color="inherit"
                    aria-label="sign-out"
                    edge="end"
                    onClick={() => {props.signOut()}} >
                    <ExitToAppIcon />
                </IconButton>
                {!(props.value.isConfigured) && (
                    <IconButton
                        className="u-margin__right"
                        edge="end"
                        color="inherit"
                        aria-label="setting"
                        onClick={() => {props.configure()}} >
                        <SettingsIcon/>
                    </IconButton>
                )}
            </Toolbar>
        </AppBar>
        </div>
    )
}

export default NavBar