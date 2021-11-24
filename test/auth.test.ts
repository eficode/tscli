import { mocked } from 'ts-jest/utils';
import { existsSync, promises } from 'fs';

import { getSessionCookies, getCurrentCookiesFrom } from '../src/auth';

jest.mock('fs');

jest.mock('../src/api', () => ({
  testAuth: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../src/cookies', () => ({
  getCookiesFromBrowser: jest.fn().mockResolvedValue({ sessionCookie: 'new-session-key' }),
}));

describe('Auth', () => {
  beforeEach(() => {
    mocked(existsSync as jest.Mock).mockReturnValue(true);
  });

  describe('get current cookie from file', () => {
    it('should return existing cookie data', async () => {
      mocked(promises.readFile as jest.Mock).mockResolvedValue('sessionCookie=working-session-key');

      expect(await getCurrentCookiesFrom('test')).toBe('sessionCookie=working-session-key');
    });
    it('should return null if file does not exist', async () => {
      mocked(existsSync as jest.Mock).mockReturnValueOnce(false);

      await expect(await getCurrentCookiesFrom('test')).toBe(null);
    });
  });

  describe('get session cookie', () => {
    it('should get current cookie and test it', async () => {
      mocked(promises.readFile as jest.Mock).mockResolvedValue('sessionCookie=working-session-key');

      expect(await getSessionCookies()).toBe('sessionCookie=working-session-key');
    });
    it('should get a new cookie if current cookie fails', async () => {
      mocked(existsSync as jest.Mock)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      expect(await getSessionCookies()).toBe('sessionCookie=new-session-key');
    });
  });
});
