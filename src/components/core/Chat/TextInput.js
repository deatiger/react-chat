import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';

class TextInput extends Component {
    render() {
        return (
            <React.Fragment>
            <form className="p-chat__textarea c-grid-center" noValidate autoComplete="off">
              <TextField
                id="standard-text"
                className="col-12"
                margin="normal"
                label="メッセージを入力..."
                multiline
                rowsMax="4"
                onChange={e => this.props.onChange(e.target.value)}
                value={this.props.value}
              />
            </form>
            </React.Fragment>
        );
    }
}

export default TextInput;
