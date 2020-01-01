import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';

class MailAddressInput extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="c-grid__row">
                    <div className="col-3">Email：</div>
                    <form className="p-chat__textarea c-grid-center" noValidate autoComplete="off">
                        <TextField
                            id="username"
                            className="col-12"
                            margin="normal"
                            label="メールアドレスを入力"
                            onChange={e => this.props.input(e.target.value)}
                            value={this.props.mail}
                        />
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

export default MailAddressInput;
