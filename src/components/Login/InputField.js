import React from 'react';
import TextField from '@material-ui/core/TextField';

const InputField = (props) => {
    const label = props.label + "を入力";
    return (
        <div className="c-grid__row">
            <form className="col-12 c-grid-center" noValidate autoComplete="off">
                <TextField
                    id={props.value}
                    className="col-12"
                    margin="normal"
                    label={label}
                    helperText={label}
                    type={props.type}
                    onChange={e => props.input(e.target.value)}
                    value={props.value}
                />
            </form>
        </div>

    );
}

export default InputField