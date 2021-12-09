import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

import jsonpath from 'jsonpath';

import { printTable } from 'console-table-printer';

import { get, post, put } from './api';
import { getCurrentPhases, Phase } from './phases';
import { getWeekdays } from './utils';

export interface Worktime {
  id: number;
  phaseId: number;
  taskId: number;
  date: string;
  duration?: number;
  description?: string;
}

/**
 * Verifies whether its input is of type `Worktime`.
 */
export const isWorktime = (worktime: any): worktime is Worktime =>
  typeof worktime === 'object' &&
  typeof worktime?.id === 'number' &&
  typeof worktime?.phaseId === 'number' &&
  typeof worktime?.taskId === 'number' &&
  typeof worktime?.date === 'string' &&
  (worktime?.duration === undefined || typeof worktime?.duration === 'number') &&
  (worktime?.description === undefined || typeof worktime?.description === 'string');

const getWorktimes = async (dt?: string): Promise<Worktime[]> => {
  // Extend DayJS
  dayjs.extend(isoWeek);

  const date = dayjs(dt);

  const weekly = await get(`worktimes/weekly?year=${date.format('YYYY')}&week=${date.isoWeek()}`);

  return weekly.worktimes.map((w: any) => {
    // Map the input into a Worktime object
    const worktime = {
      id: w.id,
      phaseId: w.task.phaseId,
      taskId: w.taskId,
      date: w.date,
      duration: w.duration || undefined,
      description: w.description || undefined,
    };

    // Assert that we indeed created a valid Worktime instance.
    if (!isWorktime(worktime)) {
      throw new Error(`Received invalid worktime ${JSON.stringify(worktime)}`);
    }

    return worktime;
  });
};

const getPhasesForDays = (phases: Phase[], worktimes: Worktime[]): { [columnName: string]: string | number }[] => {
  const weekdays = getWeekdays();

  const phasesForDays = phases.map((phase) => ({
    Name: phase.projectName === phase.name ? phase.name : `${phase.projectName} (${phase.name})`,
    Id: phase.id,
    // Add a column for each day of the week containing the worktime duration
    ...Object.fromEntries(
      weekdays.map((day) => {
        const worktime = worktimes.find((w: any) => w.date === day.date && w.phaseId === phase.id);

        return [day.name, worktime ? worktime.duration || 0 : ''];
      }),
    ),
  }));

  return phasesForDays;
};

export const getDefaultTaskFor = async (phaseId: string) => {
  if (phaseId) {
    const projects = await get('projects?active=true&userHasAccess=true');

    const defaultTasks = jsonpath.query(projects, `$..phases[?(@.id==${phaseId})].tasks[?(@.name=='No task')]`);

    if (defaultTasks && defaultTasks.length > 0) {
      return defaultTasks[0];
    }
  }

  return {};
};

export const listWeek = async () => {
  try {
    const worktimes = await getWorktimes();
    const phases = await getCurrentPhases();

    const phasesForDays = getPhasesForDays(phases, worktimes);

    printTable(phasesForDays);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export const createWorktime = async (argv: any) => {
  const task = await getDefaultTaskFor(argv.id);
  const date = dayjs(argv.date).format('YYYY-MM-DD');

  const worktimes = await getWorktimes(argv.date);

  const worktime = worktimes.find((w) => w.date === date && w.phaseId === argv.id);

  if (!date || !task.id) {
    console.log('Creating worktime failed. Please check your parameters.');
    return;
  }

  try {
    if (worktime) {
      await put(`worktimes/${worktime.id}`, {
        date,
        id: worktime.id,
        taskId: task.id,
        duration: argv.duration.toString(),
        description: argv.description,
      });

      console.log(`Updated worktime for ${date}`);
    } else {
      await post('worktimes', {
        date,
        taskId: task.id,
        duration: argv.duration.toString(),
        description: argv.description,
      });

      console.log(`Created worktime for ${date}`);
    }
  } catch (err) {
    console.log('Creating worktime failed.');
  }
};
