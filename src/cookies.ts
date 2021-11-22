import { getCookies } from 'chrome-cookies-secure';

export const getCookiesFromBrowser = async () => {
  return new Promise((resolve, reject) => {
    getCookies('https://timesheets.eficode.fi/api/employees/me', (err: any, data: any) => {
      err ? reject(err) : resolve(data);
    });
  });
};
