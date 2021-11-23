import { mocked } from 'ts-jest/utils';
import { get } from '../src/api';

import { findPhases, getCurrentPhases } from '../src/phases';

import * as testData from './data/phases.json';

jest.mock('../src/api');

describe('Phases', () => {
  describe('find phases', () => {
    it('should return phases by id', async () => {
      mocked(get as jest.Mock).mockResolvedValueOnce(testData.projects);

      const phases = [{ id: 3870, name: 'Training Queue', projectName: 'Training Queue' }];

      expect(await findPhases(3870)).toStrictEqual(phases);
    });
  });

  describe('get current phases', () => {
    it('should return empty array if there are no favorites', async () => {
      mocked(get as jest.Mock)
        .mockResolvedValueOnce(testData.projects)
        .mockResolvedValueOnce({ favoritePhases: [] });

      expect(await getCurrentPhases()).toStrictEqual([]);
    });

    it('should return empty array if there are no projects', async () => {
      mocked(get as jest.Mock)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(testData.favorites);

      expect(await getCurrentPhases()).toStrictEqual([]);
    });

    it('should return favorite phases with projects', async () => {
      mocked(get as jest.Mock)
        .mockResolvedValueOnce(testData.projects)
        .mockResolvedValueOnce(testData.favorites);

      const currentPhases = [
        { id: 3448, name: 'Transformation Work Group (Internal)', projectName: 'Transformation Work Group (Internal)' },
      ];

      expect(await getCurrentPhases()).toStrictEqual(currentPhases);
    });
  });
});
