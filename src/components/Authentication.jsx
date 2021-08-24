import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';
import { AmplifySignIn, AmplifyAuthenticator, AmplifyAuthContainer, AmplifySignUp, AmplifyForgotPassword } from '@aws-amplify/ui-react';

import { Component } from 'react';
Amplify.configure(awsconfig);

Amplify.configure({
  API: {
    endpoints: [
      {
        name: "race-api",
        endpoint: "https://rsnjuggb6c.execute-api.us-east-1.amazonaws.com/prod/",
      }
    ]
  }
})

export default class Authentication extends Component {
  render() {

    return (
      <div>
        <AmplifyAuthContainer>
          <AmplifyAuthenticator usernameAlias="username">
            <AmplifySignUp
              headerText="Hey, we're so excited to have you join us!"
              slot="sign-up"
              usernameAlias="email"
              formFields={[
                {
                  type: "username",
                  label: "Username",
                  placeholder: "Enter a username",
                  inputProps: { required: true, autocomplete: "username" },
                },
                {
                  type: "email",
                  label: "Email",
                  placeholder: "Enter your email address",
                  inputProps: { required: true, autocomplete: "username" },
                },
                {
                  type: "password",
                  label: "Password",
                  placeholder: "Enter your password",
                  inputProps: { required: true, autocomplete: "new-password" },
                },
                {
                  type: "phone_number",
                  label: "Phone Number",
                  placeholder: "Enter your phone number",
                },
              ]}
            />
            <AmplifySignIn
              headerText="Welcome Back!"
              slot="sign-in"
              usernameAlias="username"
            />

            <AmplifyForgotPassword
              headerText="Let's get you a new password!"
              slot="forgot-password"
            ></AmplifyForgotPassword>

          </AmplifyAuthenticator>
        </AmplifyAuthContainer>
      </div>
    );
  }
};

