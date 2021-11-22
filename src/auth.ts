import * as os from 'os';
import { existsSync, promises as fs } from 'fs';

import { getCookies } from 'chrome-cookies-secure';

import { get } from './api';

const createSessionDirectoryIfMissing = async () => {
  const dir = `${os.homedir()}/.tscli`;

  if (!existsSync(dir)) {
    await fs.mkdir(dir);
  }

  return dir;
};

const testCurrentSession = async (cookies: string) => {
  try {
    await get('employees/me');
    return true;
  } catch {
    return false;
  }
}

const getCurrentCookieFrom = async (filename: string) => {
  if (existsSync(filename)) {
    const content = await fs.readFile(filename, 'utf8');
    return (content.match(/(^.*)/) || [])[1] || '';
  }

  return null;
}

const collectAndSaveCookieTo = async (filename: string) => {
  const cookies: any = await new Promise((resolve, reject) => {
    getCookies('https://timesheets.eficode.fi/api/employees/me', (err: any, data: any) => {
      err ? reject(err) : resolve(data);
    });
  });

  const content = Object.keys(cookies).map((key) => `${key}=${cookies[key]}`).join('; ');

  await fs.writeFile(filename, content);

  return content;
}

export const getSessionCookie = async () => {
  const sessionDir = await createSessionDirectoryIfMissing();
  const sessionFile = `${sessionDir}/.session`;

  const cookie = await getCurrentCookieFrom(sessionFile);
  if (cookie) {
    if (await testCurrentSession(cookie)) {
      return cookie;
    }
  }

  return collectAndSaveCookieTo(sessionFile);
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
