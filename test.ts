// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
if (!process.env.CREDENTIALS !== undefined) {
  const creds = JSON.parse(process.env.CREDENTIALS || '{}');
  console.log(creds);
}
