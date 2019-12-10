import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';

class PasswordInput extends Component {
    render() {
        return (
            <React.Fragment>
            <form className="p-chat__textarea c-grid-center" noValidate autoComplete="off">
              <TextField
                id="password"
                className="col-12"
                margin="normal"
                label="パスワードを入力"
                type="password"
                onChange={(e) => this.props.onChange(e.target.value)}
                value={this.props.password}
              />
            </form>
            </React.Fragment>
        );
    }
}

export default PasswordInput;
