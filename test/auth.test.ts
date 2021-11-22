import { loggedIn } from '../src/auth';

jest.mock('fs', () => ({
  readFile: jest.fn().mockResolvedValue(''),
  existsSync: jest.fn().mockResolvedValue(true),
}));

describe('Auth', () => {
  describe('logged in', () => {

    it('should return false if .session is not set', async () => {
      await expect(loggedIn()).resolves.toBe(false);
    });
  });
});
