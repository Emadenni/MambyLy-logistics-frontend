import { Amplify } from 'aws-amplify';

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID as string;
const clientId   = import.meta.env.VITE_COGNITO_CLIENT_ID as string;
const region     = import.meta.env.VITE_AWS_REGION as string;

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId: clientId,
      loginWith: { username: false, email: true, phone: false },
    },
  },
});
