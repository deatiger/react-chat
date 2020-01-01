import React from 'react';
import Button from '@material-ui/core/Button';

export default function MailLoginButton(props) {
    return (
        <Button
            className="col-12 mb-2"
            variant="contained"
            color="secondary.light"
            onClick={() => props.signIn(props.mail, props.password)}>
            メールアドレスでログイン
        </Button>
    );
}