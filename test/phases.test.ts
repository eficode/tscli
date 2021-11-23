import { mocked } from 'ts-jest/utils';
import { get } from '../src/api';

import { getCurrentPhases } from '../src/phases';

import * as testData from './data/phases.json';

jest.mock('../src/api');

describe('Phases', () => {
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
      const CURRENT_PHASES = [
        { id: 3448, name: 'Transformation Work Group (Internal)', projectName: 'Transformation Work Group (Internal)' },
      ];

      mocked(get as jest.Mock)
        .mockResolvedValueOnce(testData.projects)
        .mockResolvedValueOnce(testData.favorites);

      expect(await getCurrentPhases()).toStrictEqual(CURRENT_PHASES);
    });
  });
});
