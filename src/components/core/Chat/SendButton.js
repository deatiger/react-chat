import React from 'react';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

const SendButton = (props) => {
    return (
        <Button
            variant="contained"
            color="primary"
            className="p-chat__button-send"
            onClick={() => props.onClick(props.value, props.roomId, props.fromId, props.toId, props.userIds)}>
          <Icon>send</Icon>
        </Button>
    );
}

export default SendButton;
