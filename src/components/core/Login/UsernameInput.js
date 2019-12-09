import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';

class UsernameInput extends Component {
    render() {
        return (
            <React.Fragment>
            <form className="p-chat__textarea c-grid-center" noValidate autoComplete="off">
              <TextField
                id="username"
                className="col-12"
                margin="normal"
                label="ユーザー名を入力"
              />
            </form>
            </React.Fragment>
        );
    }
}

export default UsernameInput;
