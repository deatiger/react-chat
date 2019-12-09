import React from 'react';
import Switch from '@material-ui/core/Switch';

const MuteSwitch = (props) => {
    return (
        <div>
            <Switch
                checked={!props.value.isMute}
                onClick={() => props.onClick(props.value)}
                color="primary"
                inputProps={{'aria-label': 'primary checkbox'}}
            />
        </div>
    )
};
export default MuteSwitch