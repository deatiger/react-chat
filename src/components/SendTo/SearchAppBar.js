import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CreateSharpIcon from '@material-ui/icons/CreateSharp';
import KeyboardBackspaceSharp from '@material-ui/icons/KeyboardBackspaceSharp';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  bar: {
    paddingLeft: 14,
    paddingRight: 14,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

export default function SearchAppBar(props) {
  const classes = useStyles();
  const placeHolder = (props.isUserListHeader) ? "宛先を検索" : "メッセージを検索";

  return (
    <div className={classes.root}>
      <AppBar position="static" color="secondary">
        <Toolbar className={classes.bar}>
          {(props.isUserListHeader) && (
              <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="done"
                  onClick={() => {props.switchList(props.isUserListHeader)}}>
                <KeyboardBackspaceSharp />
              </IconButton>
          )}
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder={placeHolder}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={e => props.searchFunc(e.target.value, props.value)}
            />
          </div>
          <IconButton
              aria-label="sign-out"
              edge="end"
              color="inherit"
              onClick={() => {props.signOut()}} >
            <ExitToAppIcon />
          </IconButton>
          {(props.isUserListHeader) ? (
              <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="done"
                  onClick={() => {props.createRoom(props.selectedUsers, props.userId, props.rooms)}}>
                <span className="u-text-smaller">OK</span>
              </IconButton>
          ) : (
              <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="create"
                  onClick={() => {props.switchList(props.isUserListHeader)}}>
                <CreateSharpIcon />
              </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}