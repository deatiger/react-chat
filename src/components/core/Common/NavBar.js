import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import KeyboardBackspaceSharp from '@material-ui/icons/KeyboardBackspaceSharp';

const NavBar = (props) => {
    return (
        <AppBar position="static" color="secondary">
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="back"
                    onClick={() => {props.back()}} >
                    <KeyboardBackspaceSharp />
                </IconButton>
                {!(props.value.isConfigured) && (
                    <IconButton
                        className="ml-auto"
                        edge="end"
                        color="inherit"
                        aria-label="setting"
                        onClick={() => {props.configure()}} >
                        <SettingsIcon/>
                    </IconButton>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default NavBar