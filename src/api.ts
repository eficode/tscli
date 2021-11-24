import fetch from 'node-fetch';

import { getSessionCookies } from './auth';

export const ENDPOINT = process.env.ENDPOINT || 'https://timesheets.eficode.fi/api';

const handleFetch = async (url: string, params: any = {}) => {
  try {
    const cookie = await getSessionCookies();

    const opts = {
      header: {
        cookie,
        'content-Type': 'application/json;charset=UTF-8',
      },
    };

    const response = await fetch(`${ENDPOINT}/${url}`, { ...opts, ...params });

    return response.json();
  } catch (err) {
    console.log(err);
    throw new Error('oops');
  }
};

export const testAuth = async (cookie: any) => {
  const opts = { headers: { cookie } };

  const response = await fetch(`${ENDPOINT}/me`, opts);
  return response.json();
};

export const get = async (url: string) => {
  return handleFetch(`${ENDPOINT}/${url}`);
};

export const post = async (url: string, params: any) => {
  return handleFetch(url, { method: 'POST', body: JSON.stringify(params) });
};

export const put = async (url: string, params: any) => {
  return handleFetch(url, { method: 'PUT', body: JSON.stringify(params) });
};
