import { mocked } from 'ts-jest/utils';
import { get } from '../src/api';

import { findProjectsAndTasks } from '../src/projects';

import * as testData from './data/phases.json';

jest.mock('../src/api');

describe('Projects', () => {
  describe('find projects and tasks', () => {
    it('should return empty if no projects were found', async () => {
      mocked(get as jest.Mock)
        .mockResolvedValueOnce(testData.projects)

      expect(await findProjectsAndTasks({ name: null })).toStrictEqual([]);
    });
  });
});
