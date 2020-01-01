import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import ArrowForwardIosIcon from "@material-ui/core/SvgIcon/SvgIcon";
import ListItem from "@material-ui/core/ListItem";

const ExitRoom = (props) => {
    return (
        <ListItem className="px-2" onClick={() => props.exit(props.value)}>
            <ListItemText
                className="u-text-orange"
                primary="グループチャットを退出"
            />
            <ArrowForwardIosIcon edge="end" />
        </ListItem>
    )
};

export default ExitRoom