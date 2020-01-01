import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import NotificationsOffIcon from "@material-ui/core/SvgIcon/SvgIcon";
import NotificationsActiveIcon from "@material-ui/core/SvgIcon/SvgIcon";
import * as Configuration from "./index";

const MuteListItem = (props) => {
    const muteState = (props.value.isMute) ? "OFF" : "ON";
    const muteIcon = (props.value.isMute) ? <NotificationsOffIcon color="secondary" /> : <NotificationsActiveIcon color="secondary" />;

    return (
        <ListItem className="px-2">
            <ListItemText primary="通知の設定" />
            <ListItemText primary={muteState} />
            {muteIcon}
            <Configuration.MuteSwitch value={props.value} onClick={props.switch} />
        </ListItem>
    )
};

export default MuteListItem