const { google } = require('googleapis');
const { auth } = require('google-auth-library');

const authorize = async (credentials) => {
  const client = await auth.getClient({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth: client });
}
module.exports = authorize;
