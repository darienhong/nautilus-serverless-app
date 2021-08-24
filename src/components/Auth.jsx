import { React, useEffect, useState } from 'react';
import '../App.css';
import Amplify from 'aws-amplify';
import { AmplifyAuthenticator, withAuthenticator } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsconfig from '../aws-exports';
import '../App.css';
import {
    Redirect,
} from 'react-router-dom';

Amplify.configure(awsconfig);

function AuthStateApp() {
    const [authState, setAuthState] = useState();
    const [user, setUser] = useState();

    useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData);
            localStorage.setItem("username", authData.username);
            console.log(authData.username);
        });
    }, []);

    return authState === AuthState.SignedIn && user ? (
        <div className="App">
            <Redirect to="/Home" />
        </div>
    ) : (
        <AmplifyAuthenticator />
    );
}

export default withAuthenticator(AuthStateApp);