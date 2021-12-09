import { mocked } from 'ts-jest/utils';
import { get } from '../src/api';

import { getDefaultTaskFor, isWorktime, Worktime } from '../src/worktimes';

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

      const task = { id: 12306, name: 'No task', phaseId: 3448 };

      expect(await getDefaultTaskFor('3870')).toStrictEqual(task);
    });
  });

  describe('isWorktime', () => {
    it('should accept a valid Worktime object', () => {
      // Arrange
      const phase: Worktime = {
        id: 1,
        phaseId: 2,
        taskId: 3,
        date: '2021-11-19',
        duration: 4,
        description: 'My description',
      };

      // Act
      const isValid = isWorktime(phase);

      // Assert
      expect(isValid).toBe(true);
    });

    it('should accept a Worktime object without a description', () => {
      // Arrange
      const phase: Worktime = {
        id: 1,
        phaseId: 2,
        taskId: 3,
        date: '2021-11-19',
        duration: 4,
      };

      // Act
      const isValid = isWorktime(phase);

      // Assert
      expect(isValid).toBe(true);
    });

    it('should reject Worktime objects missing the id field', () => {
      // Arrange
      const phase: Omit<Worktime, 'id'> = {
        phaseId: 2,
        taskId: 3,
        date: '2021-11-19',
        duration: 4,
      };

      // Act
      const isValid = isWorktime(phase);

      // Assert
      expect(isValid).toBe(false);
    });

    it('should reject Worktime objects missing the phaseId field', () => {
      // Arrange
      const phase: Omit<Worktime, 'phaseId'> = {
        id: 1,
        taskId: 3,
        date: '2021-11-19',
        duration: 4,
      };

      // Act
      const isValid = isWorktime(phase);

      // Assert
      expect(isValid).toBe(false);
    });

    it('should reject Worktime objects missing the taskId field', () => {
      // Arrange
      const phase: Omit<Worktime, 'taskId'> = {
        id: 1,
        phaseId: 2,
        date: '2021-11-19',
        duration: 4,
      };

      // Act
      const isValid = isWorktime(phase);

      // Assert
      expect(isValid).toBe(false);
    });

    it('should reject Worktime objects missing the date field', () => {
      // Arrange
      const phase: Omit<Worktime, 'date'> = {
        id: 1,
        phaseId: 2,
        taskId: 3,
        duration: 4,
      };

      // Act
      const isValid = isWorktime(phase);

      // Assert
      expect(isValid).toBe(false);
    });

    it('should accept Worktime objects missing the duration field', () => {
      // Arrange
      const phase: Omit<Worktime, 'duration'> = {
        id: 1,
        phaseId: 2,
        taskId: 3,
        date: '2021-11-19',
      };

      // Act
      const isValid = isWorktime(phase);

      // Assert
      expect(isValid).toBe(true);
    });

    it('should reject Worktime objects with null for the description', () => {
      // Arrange
      const phase: Omit<Worktime, 'description'> & { description: any } = {
        id: 1,
        phaseId: 2,
        taskId: 3,
        date: '2021-11-19',
        duration: 4,
        description: null,
      };

      // Act
      const isValid = isWorktime(phase);

      // Assert
      expect(isValid).toBe(false);
    });
  });
});
