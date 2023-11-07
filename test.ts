// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

if (process.env.CREDENTIALS == undefined) {
  throw new Error('Missing environment variable CREDENTIALS');
} else {
  const credentials = JSON.parse(process.env.CREDENTIALS);
  console.log(`client_email: ${credentials.client_email}`);
  console.log(`private_key: ${credentials.private_key}`);
}
