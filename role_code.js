
const ManagementClient = require('auth0').ManagementClient;
const AuthenticationClient = require('auth0').AuthenticationClient;

exports.onExecutePostLogin = async (event, api) => {
  // !ATTENTION! ---- Changez le DOMAIN pour votre adresse Auth0 ---- !ATTENTION!
  const DOMAIN = 'dev-t2ru3diusrdscg80.us.auth0.com';
  const auth0 = new AuthenticationClient({
    domain: DOMAIN,
    clientId: event.secrets.M2M_CLIENT_ID,
    clientSecret: event.secrets.M2M_CLIENT_SECRET
  });
  const response = await auth0.clientCredentialsGrant({
    audience: `https://${DOMAIN}/api/v2`,
    scope: 'read:users update:users read:roles'
  });
  const API_TOKEN = response.access_token;
  const management = new ManagementClient({
    domain: DOMAIN,
    token: API_TOKEN
  });

  const params = { id: event.user.user_id };
  const roles = await management.getUserRoles(params);

  // Vous pouvez utiliser le namespace que vous voulez, mais c'est nécessaire car 
  // le custom claim "roles" est réservé par Auth0
  const namespace = 'monApp';
  if (event.authorization) {
    api.idToken.setCustomClaim(`${namespace}/roles`, roles);
    api.accessToken.SetCustomClaim(`${namespace}/roles`, roles);
  }
};
