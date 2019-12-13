import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';

class NameInput extends Component {
    render() {
        return (
            <React.Fragment>
                <form className="p-chat__textarea c-grid-center" noValidate autoComplete="off">
                    <TextField
                        id="standard-text"
                        className="col-12"
                        margin="normal"
                        label="グループ名を変更する"
                        rowsMax="1"
                        onChange={e => this.props.onChange(e.target.value)}
                        value={this.props.name}
                    />
                </form>
            </React.Fragment>
        );
    }
}

export default NameInput;
