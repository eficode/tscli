import { mocked } from 'ts-jest/utils';
import { get } from '../src/api';

import { getDefaultTaskFor } from '../src/worktimes';

import * as testData from './data/phases.json';

jest.mock('console-table-printer');
jest.mock('../src/api');

describe('Worktimes', () => {
  describe('get default task for', () => {
    it('should return empty hash if phase is missing', async () => {
      mocked(get as jest.Mock).mockResolvedValueOnce(testData.projects);

      expect(await getDefaultTaskFor('')).toStrictEqual({});
    });

    it('should return empty hash if phase is missing', async () => {
      mocked(get as jest.Mock).mockResolvedValueOnce(testData.projects);

      const task = {id: 12306, name: "No task", phaseId: 3448};

      expect(await getDefaultTaskFor('3870')).toStrictEqual(task);
    });
  });
});
