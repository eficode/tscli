import { getCookies } from 'chrome-cookies-secure';

const combineCookieString = (data: any) => {
  const cookies = Object.keys(data)
    .map((key: any) => `${key}=${data[key]}`)
    .join('; ');

    return cookies;
};

export const getCookiesFromBrowser = async () => {
  return new Promise((resolve, reject) => {
    getCookies('https://timesheets.eficode.fi', (err: any, data: any) => {
      if (err) { reject(err); }

      resolve(combineCookieString(data));
    });
  });
};
