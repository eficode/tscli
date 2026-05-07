import * as path from 'path';
import { resolveProfile } from '../src/cookies';

const fixtureDir = path.join(__dirname, 'data/chrome-profiles');

describe('resolveProfile', () => {
  it('matches by account email', () => {
    expect(resolveProfile('first.last@eficode.com', fixtureDir)).toBe('Profile 1');
  });

  it('matches by profile display name', () => {
    expect(resolveProfile('Eficode', fixtureDir)).toBe('Profile 1');
  });

  it('matches by directory name', () => {
    expect(resolveProfile('Profile 2', fixtureDir)).toBe('Profile 2');
  });

  it('auto-detects an @eficode.com profile when no hint is given', () => {
    expect(resolveProfile(undefined, fixtureDir)).toBe('Profile 1');
  });

  it('returns the hint when no profile matches', () => {
    expect(resolveProfile('Profile 9', fixtureDir)).toBe('Profile 9');
  });

  it('returns the hint when the chrome dir does not exist', () => {
    expect(resolveProfile('Default', '/nonexistent/path')).toBe('Default');
  });

  it('returns undefined when no hint, no chrome dir, and no eficode profile', () => {
    expect(resolveProfile(undefined, '/nonexistent/path')).toBeUndefined();
  });
});
