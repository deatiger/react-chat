import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import ArrowForwardIosIcon from "@material-ui/core/SvgIcon/SvgIcon";
import ListItem from "@material-ui/core/ListItem";

const DeleteChat = (props) => {
    return (
        <ListItem className="px-2" onClick={() => props.delete(props.value)}>
            <ListItemText
                className="u-text-orange"
                primary="チャットを削除"
            />
            <ArrowForwardIosIcon edge="end" />
        </ListItem>
    )
}

export default DeleteChat