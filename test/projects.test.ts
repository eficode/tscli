import { mocked } from 'ts-jest/utils';
import { get } from '../src/api';

import { searchProjects } from '../src/projects';

import * as testData from './data/phases.json';

jest.mock('console-table-printer');
jest.mock('../src/api');

describe('Projects', () => {
  describe('find projects and tasks', () => {
    it('should return empty if search is empty', async () => {
      mocked(get as jest.Mock).mockResolvedValueOnce(testData.projects);

      expect(await searchProjects('')).toStrictEqual([]);
    });

    it('should return empty if no projects were found', async () => {
      mocked(get as jest.Mock).mockResolvedValueOnce(testData.projects);

      expect(await searchProjects('Not existing project')).toStrictEqual([]);
    });

    it('should return projects with a keyword', async () => {
      mocked(get as jest.Mock).mockResolvedValueOnce(testData.projects);

      const foundProjects = [{ id: 3448, name: 'Transformation Work Group (Internal)', projectName: 'Transformation Work Group (Internal)' }];

      expect(await searchProjects('nsforma')).toStrictEqual(foundProjects);
    });
  });
});
