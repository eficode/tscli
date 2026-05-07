import * as path from 'path';
import * as os from 'os';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { getCookies } from 'chrome-cookies-secure';

const combineCookieString = (data: any) => {
  const cookies = Object.keys(data)
    .map((key: any) => `${key}=${data[key]}`)
    .join('; ');

  return cookies;
};

const resolveProfile = (profileOrHint: string): string => {
  const chromeDir = path.join(os.homedir(), 'Library/Application Support/Google/Chrome');
  const dirs = readdirSync(chromeDir);

  for (const dir of dirs) {
    const prefsFile = path.join(chromeDir, dir, 'Preferences');
    if (!existsSync(prefsFile)) continue;

    try {
      const prefs = JSON.parse(readFileSync(prefsFile, 'utf8'));
      const name: string = prefs?.profile?.name ?? '';
      const email: string = prefs?.account_info?.[0]?.email ?? '';

      if (dir === profileOrHint || name === profileOrHint || email === profileOrHint) {
        return dir;
      }
    } catch {
      /* skip unreadable profiles */
    }
  }

  return profileOrHint;
};

const CHROME_PROFILE = resolveProfile(process.env.CHROME_PROFILE || 'Default');

export const getCookiesFromBrowser = async () => {
  return new Promise((resolve, reject) => {
    getCookies(
      'https://timesheets.eficode.fi',
      'object' as any,
      (err: any, data: any) => {
        if (err) {
          reject(err);
        }

        resolve(combineCookieString(data));
      },
      CHROME_PROFILE,
    );
  });
};
