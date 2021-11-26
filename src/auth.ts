import * as os from 'os';
import { existsSync, promises as fs } from 'fs';

import { testAuth } from './api';
import { getCookiesFromBrowser } from './cookies';

export const HOMEPAGE = process.env.HOMEPAGE || 'https://timesheets.eficode.fi';

const createSessionDirectoryIfMissing = async () => {
  const dir = `${os.homedir()}/.tscli`;

  if (!existsSync(dir)) {
    await fs.mkdir(dir);
  }

  return dir;
};

const testCurrentSession = async (cookies: any) => {
  try {
    await testAuth(cookies);
    return true;
  } catch (err) {
    console.log('Current session failed, refreshing cookie information...');
    return false;
  }
};

const failSessionIfError = async (cookies: any) => {
  try {
    await testAuth(cookies);
  } catch (err) {
    console.log(`Authentication failed. Please login to ${HOMEPAGE} and try again.`);
    process.exit(1);
  }
};

export const getCurrentCookiesFrom = async (filename: string) => {
  if (existsSync(filename)) {
    const content = await fs.readFile(filename, 'utf8');

    return (content.match(/(^.*)/) || [])[1] || '';
  }

  return null;
};

const saveCookiesTo = async (filename: string, cookies: any) => {
  await fs.writeFile(filename, cookies);

  return cookies;
};

export const getSessionCookies = async () => {
  const sessionDir = await createSessionDirectoryIfMissing();
  const sessionFile = `${sessionDir}/.session`;

  const cookies = await getCurrentCookiesFrom(sessionFile);

  if (cookies) {
    if (await testCurrentSession(cookies)) {
      return cookies;
    }
  }

  const newCookies = await getCookiesFromBrowser();

  await saveCookiesTo(sessionFile, newCookies);
  await failSessionIfError(newCookies);

  return newCookies;
};
