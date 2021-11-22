import { google } from 'googleapis';
import open from 'open';

import io from 'socket.io-client';

import { getCookies } from 'chrome-cookies-secure';

import * as os from 'os';
import { existsSync, promises as fs } from 'fs';
import { drive } from 'googleapis/build/src/apis/drive';

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

const createSessionDirectoryIfMissing = async () => {
  const dir = `${os.homedir()}/.tscli`;

  if (!existsSync(dir)) {
    await fs.mkdir(dir);
  }

  return dir;
};

export const getSessionCookie = async () => {
  const sessionDir = await createSessionDirectoryIfMissing();
  const sessionFile = `${sessionDir}/.session`;

  if (existsSync(sessionFile)) {
    const content = await fs.readFile(sessionFile, 'utf8');
    return (content.match(/(^.*)/) || [])[1] || '';
  }

  const cookies: any = await new Promise((resolve, reject) => {
    getCookies('https://timesheets.eficode.fi/api/employees/me', (err: any, cookies: any) => {
      err ? reject(err) : resolve(cookies);
    });
  });

  const content = Object.keys(cookies).map((key) => `${key}=${cookies[key]}`).join('; ');

  console.log(content);

  await fs.writeFile(sessionFile, content);

  return content;
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
