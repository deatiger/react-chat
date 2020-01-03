import React from 'react';
import TextField from '@material-ui/core/TextField';

const TextInput = (props) => {
    return (
        <form className="p-chat__textarea c-grid-center" noValidate autoComplete="off">
            <TextField
                id="standard-text"
                className="c-grid-full"
                margin="normal"
                label="メッセージを入力..."
                multiline
                rowsMax="4"
                onChange={e => props.onChange(e.target.value)}
                value={props.value}
            />
        </form>
    );
};

export default TextInput;
