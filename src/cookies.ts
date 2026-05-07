import { getCookies } from 'chrome-cookies-secure';

const combineCookieString = (data: any) => {
  const cookies = Object.keys(data)
    .map((key: any) => `${key}=${data[key]}`)
    .join('; ');

  return cookies;
};

const CHROME_PROFILE = process.env.CHROME_PROFILE || 'Default';

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
