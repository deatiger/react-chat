import React from 'react';
import Button from '@material-ui/core/Button';
import {firebaseApp, database} from '../../../firebase/index'

const queryUserValue = async (id) => {
    return database.ref('users').child(id).once('value')
};

export default function LoginButton(props) {
    return (
        <Button variant="contained" color="primary" onClick={() =>
            // Sign in
            firebaseApp.auth().signInWithEmailAndPassword(props.email, props.password)
                .then(async user => {
                    if (user) {
                        const snapshot = await queryUserValue(user.user.uid);
                        const userValue = snapshot.val();
                        props.signIn({
                            userId: user.user.uid,
                            userPhoto: (userValue.photoPath) ? userValue.photoPath : "https://firebasestorage.googleapis.com/v0/b/react-chat-28bf1.appspot.com/o/images%2FFAVPNG_user-profile-user-interface_NsQdunae.png?alt=media&token=2e32f1c5-d0bf-4260-88d4-c8611a808bc4"
                        })
                    }
                })
            }>
            Login
        </Button>
    );
}