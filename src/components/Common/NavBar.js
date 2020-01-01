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
                <div className="c-grid__row mr-0">
                    <div className="ml-auto">
                    <IconButton
                        color="inherit"
                        aria-label="sign-out"
                        onClick={() => {props.signOut()}} >
                        <ExitToAppIcon />
                    </IconButton>
                    {!(props.value.isConfigured) && (
                        <IconButton
                            color="inherit"
                            aria-label="setting"
                            onClick={() => {props.configure()}} >
                            <SettingsIcon/>
                        </IconButton>
                    )}
                    </div>
                </div>
            </Toolbar>
        </AppBar>
        </div>
    )
}

export default NavBar