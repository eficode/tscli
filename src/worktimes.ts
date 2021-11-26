import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

import jsonpath from 'jsonpath';

import { printTable } from 'console-table-printer';

import { get, post, put } from './api';
import { getCurrentPhases } from './phases';
import { getWeekdays } from './utils';

const getWorktimes = async (dt?: string) => {
  dayjs.extend(isoWeek);

  const date = dayjs(dt);

  const weekly = await get(`worktimes/weekly?year=${date.format('YYYY')}&week=${date.isoWeek()}`);

  return weekly.worktimes.map((w: any) => ({
    id: w.id,
    phaseId: w.task.phaseId,
    taskId: w.taskId,
    date: w.date,
    duration: w.duration,
  }));
};

const getPhasesForDays = (phases: any, worktimes: any) => {
  const weekdays = getWeekdays();

  const phasesForDays = phases.map((phase: any) => {
    const phaseWeek: { [name: string]: string } = {
      Name: phase.projectName === phase.name ? phase.name : `${phase.projectName} (${phase.name})`,
      Id: phase.id,
    };
    weekdays.forEach((day) => {
      const worktime = worktimes.find((w: any) => w.date === day.date && w.phaseId === phase.id);
      if (worktime) {
        phaseWeek[day.name] = worktime.duration || 0;
      } else {
        phaseWeek[day.name] = '';
      }
    });
    return phaseWeek;
  });

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

    const phasesForDays = await getPhasesForDays(phases, worktimes);

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

  const worktime = worktimes.find((w: any) => w.date === date && w.phaseId === argv.id);

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
