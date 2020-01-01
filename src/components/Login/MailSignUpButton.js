import React from 'react';
import Button from '@material-ui/core/Button';

export default function MailSignUpButton(props) {
    return (
        <Button
            className="col-12"
            variant="contained"
            color="secondary.light"
            onClick={() => props.signUp(props.mail, props.password)}>
            メールアドレスで登録する
        </Button>
    );
}