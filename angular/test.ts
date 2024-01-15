// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const CALENDAR_SERVICE_ACC_CREDENTIALS = {
  type: process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_TYPE,
  project_id: process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_PROJECT_ID,
  private_key_id: process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_PRIVATE_KEY_ID,
  private_key: process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_PRIVATE_KEY,
  client_email: process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_CLIENT_EMAIL,
  client_id: process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_CLIENT_ID,
  auth_uri: process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_AUTH_URI,
  token_uri: process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url:
    process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_CLIENT_X509_CERT_URL,
  universe_domain: process.env.CALENDAR_SERVICE_ACC_CREDENTIALS_UNIVERSE_DOMAIN
};

console.log(JSON.stringify(CALENDAR_SERVICE_ACC_CREDENTIALS, null, 2));
