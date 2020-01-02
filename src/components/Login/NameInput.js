import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';

class NameInput extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="c-grid__row">
                    <div className="col-3">Name：</div>
                    <form className="p-chat__textarea c-grid-center" noValidate autoComplete="off">
                        <TextField
                            id="username"
                            className="col-12"
                            margin="normal"
                            label="名前を入力(新規登録時のみ)"
                            onChange={e => this.props.input(e.target.value)}
                            value={this.props.name}
                        />
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

export default NameInput;
