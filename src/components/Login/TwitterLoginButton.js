import React from 'react';
import Button from '@material-ui/core/Button';


export default function TwitterLoginButton(props) {

    return (
        <Button
            className="col-12 mb-2"
            color="primary"
            onClick={() => props.signIn()}
            variant="contained">
            Twitterアカウントでログイン
        </Button>
    );
}