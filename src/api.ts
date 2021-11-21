import fetch from 'node-fetch';

import { getSessionCookie } from './auth';

const ENDPOINT = process.env.ENDPOINT || 'https://timesheets.eficode.fi/api';

export const getUser = async () => {
  const cookie = await getSessionCookie();

  const opts = { headers: { cookie } };

  const response = await fetch(`${ENDPOINT}/me`, opts);
  return response.json();
};

export const get = async (url: string) => {
  const cookie = await getSessionCookie();

  const opts = { headers: { cookie } };

  const response = await fetch(`${ENDPOINT}/${url}`, opts);
  return response.json();
};

export const post = async (url: string, params: any) => {
  const cookie = await getSessionCookie();

  const headers = {
    cookie,
    'content-Type': 'application/json;charset=UTF-8',
  };

  const response = await fetch(`${ENDPOINT}/${url}`, {
    headers,
    method: 'POST',
    body: JSON.stringify(params),
  });

  return response.json();
};
