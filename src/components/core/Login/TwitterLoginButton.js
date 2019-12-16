import React from 'react';
import Button from '@material-ui/core/Button';


export default function TwitterLoginButton(props) {

    return (
        <Button
            className="col-lg-4 col-md-6 col-sm-10 col-xs-12 mx-auto mb-2"
            color="primary"
            onClick={() => props.signIn()}
            variant="contained">
            Twitterアカウントでログイン
        </Button>
    );
}