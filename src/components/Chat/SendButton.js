import React from 'react';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';

const SendButton = (props) => {
    return (
        <Button
            variant="contained"
            color="primary"
            className="p-chat__button-send"
            onClick={() => props.onClick(props.value, props.roomId, props.fromId, props.toId, props.userIds)}>
          <SendIcon />
        </Button>
    );
}

export default SendButton;
