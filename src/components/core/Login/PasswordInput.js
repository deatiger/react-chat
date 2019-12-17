import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';

class PasswordInput extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="c-grid__row">
                    <div className="col-3">PW：</div>
                    <form className="p-chat__textarea c-grid-center" noValidate autoComplete="off">
                        <TextField
                            id="password"
                            className="col-12"
                            margin="normal"
                            label="パスワードを入力"
                            type="password"
                            onChange={e => this.props.input(e.target.value)}
                            value={this.props.password}
                        />
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

export default PasswordInput;
