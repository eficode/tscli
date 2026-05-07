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

const getChromeUserDataDir = (): string | undefined => {
  const home = os.homedir();
  switch (process.platform) {
    case 'darwin':
      return path.join(home, 'Library/Application Support/Google/Chrome');
    case 'linux':
      return path.join(home, '.config/google-chrome');
    case 'win32':
      return path.join(process.env.LOCALAPPDATA ?? path.join(home, 'AppData/Local'), 'Google/Chrome/User Data');
    default:
      return undefined;
  }
};

const resolveProfile = (profileOrHint?: string): string | undefined => {
  const chromeDir = getChromeUserDataDir();
  if (!chromeDir || !existsSync(chromeDir)) return profileOrHint;

  let eficodeProfile: string | undefined;

  for (const dir of readdirSync(chromeDir)) {
    const prefsFile = path.join(chromeDir, dir, 'Preferences');
    if (!existsSync(prefsFile)) continue;

    try {
      const prefs = JSON.parse(readFileSync(prefsFile, 'utf8'));
      const name: string = prefs?.profile?.name ?? '';
      const email: string = prefs?.account_info?.[0]?.email ?? '';

      if (profileOrHint && (dir === profileOrHint || name === profileOrHint || email === profileOrHint)) {
        return dir;
      }

      if (!profileOrHint && email.endsWith('@eficode.com')) {
        eficodeProfile = dir;
      }
    } catch {
      /* skip unreadable profiles */
    }
  }

  return eficodeProfile ?? profileOrHint;
};

export const getCookiesFromBrowser = async () => {
  const profile = resolveProfile(process.env.CHROME_PROFILE);
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
      profile,
    );
  });
};
