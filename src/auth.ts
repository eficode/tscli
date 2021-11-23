import * as os from 'os';
import { existsSync, promises as fs } from 'fs';

import { testAuth } from './api';
import { getCookiesFromBrowser } from './cookies';

const createSessionDirectoryIfMissing = async () => {
  const dir = `${os.homedir()}/.tscli`;

  if (!existsSync(dir)) {
    await fs.mkdir(dir);
  }

  return dir;
};

const testCurrentSession = async (cookies: string) => {
  try {
    await testAuth(cookies);
    return true;
  } catch (err) {
    return false;
  }
};

export const getCurrentCookieFrom = async (filename: string) => {
  if (existsSync(filename)) {
    const content = await fs.readFile(filename, 'utf8');

    return (content.match(/(^.*)/) || [])[1] || '';
  }

  return null;
};

const collectAndSaveCookieTo = async (filename: string) => {
  const cookies: any = await getCookiesFromBrowser();

  const content = Object.keys(cookies)
    .map((key) => `${key}=${cookies[key]}`)
    .join('; ');

  await fs.writeFile(filename, content);

  return content;
};

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
