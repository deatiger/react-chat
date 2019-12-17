import React from 'react';
import Button from '@material-ui/core/Button';

export default function ToggleButton(props) {
    return (
        <Button
            className="col-12"
            variant="contained"
            color="secondary"
            onClick={() => props.toggleIsHidden()}>
            メールアドレスログインを利用する
        </Button>
    );
}