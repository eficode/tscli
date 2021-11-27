import { mocked } from 'ts-jest/utils';
import { get } from '../src/api';

import { findPhases, getCurrentPhases, isPhase, Phase } from '../src/phases';

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

  describe('isPhase', () => {
    it('should accept a valid Phase object', () => {
      // Arrange
      const phase: Phase = {
        id: 1,
        name: "Phase name",
        projectName: "Project name",
      }

      // Act
      const isCorrectPhase = isPhase(phase)

      // Assert
      expect(isCorrectPhase).toBe(true)
    })

    it('should reject Phase objects missing the id-field', () => {
      // Arrange
      const phase: Omit<Phase, "id"> = {
        name: "Phase name",
        projectName: "Project name",
      }

      // Act
      const isCorrectPhase = isPhase(phase)

      // Assert
      expect(isCorrectPhase).toBe(false)
    })

    it('should reject Phase objects missing the name-field', () => {
      // Arrange
      const phase: Omit<Phase, "name"> = {
        id: 1,
        projectName: "Project name",
      }

      // Act
      const isCorrectPhase = isPhase(phase)

      // Assert
      expect(isCorrectPhase).toBe(false)
    })

    it('should reject Phase objects missing the projectName-field', () => {
      // Arrange
      const phase: Omit<Phase, "projectName"> = {
        id: 1,
        name: "Phase name",
      }

      // Act
      const isCorrectPhase = isPhase(phase)

      // Assert
      expect(isCorrectPhase).toBe(false)
    })

    it('should reject Phase objects with not a number as the id', () => {
      // Arrange
      const phase: Omit<Phase, "id"> & {id: any} = {
        id: "1",
        name: "Phase name",
        projectName: "Project name",
      }

      // Act
      const isCorrectPhase = isPhase(phase)

      // Assert
      expect(isCorrectPhase).toBe(false)
    })

    it('should reject Phase objects with not a string as the name', () => {
      // Arrange
      const phase: Omit<Phase, "name"> & {name: any} = {
        id: 1,
        name: {},
        projectName: "Project name",
      }

      // Act
      const isCorrectPhase = isPhase(phase)

      // Assert
      expect(isCorrectPhase).toBe(false)
    })


    it('should reject Phase objects with not a string as the projectName', () => {
      // Arrange
      const phase: Omit<Phase, "projectName"> & {projectName: any} = {
        id: 1,
        name: "Name",
        projectName: null,
      }

      // Act
      const isCorrectPhase = isPhase(phase)

      // Assert
      expect(isCorrectPhase).toBe(false)
    })
  })
});
