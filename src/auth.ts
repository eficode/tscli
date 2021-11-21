import { google } from 'googleapis';
import open from 'open';

import io from 'socket.io-client';

import { promises as fs } from 'fs';

const openAuthUrl = (id: string) => {
  const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:8000/login',
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.email'],
  });

  open(`${url}&state=${id}`);
};

export const getSessionCookie = async () => {
  const content = await fs.readFile('.session', 'utf8');
  return (content.match(/(^.*)/) || [])[1] || '';
};

export const loggedIn = async () => {
  try {
    const session: string = await getSessionCookie();

    if (session) {
      return true;
    }
  } catch (err) {} // tslint:disable-line:no-empty

  return false;
};

export const login = async () => {
  const socket = io('http://localhost:8000');

  socket.on('connect', () => {
    openAuthUrl(socket.id);
  });

  socket.on('token', async (token) => {
    await fs.writeFile('.session', token);

    process.exit();
  });

  socket.on('error', (err) => {
    process.exit(1);
  });
};
