import React from 'react';
import Button from '@material-ui/core/Button';
import {firebaseApp} from '../../../firebase/index'

export default function AnonymousLoginButton(props) {
    return (
        <Button
            className="col-lg-4 col-md-6 col-sm-10 col-xs-12 mx-auto"
            variant="contained"
            color="primary"
            onClick={() => props.signIn}>
            匿名アカウントでログイン
        </Button>
    );
}