import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

import jsonpath from 'jsonpath';

import { printTable } from 'console-table-printer';

import { get, post, put } from './api';
import { getWeekdays } from './utils';

const getCurrentPhases = async () => {
  const projects = await get('projects?active=true&userHasAccess=true');
  const favorites: any = await get('preferences/favoritePhases');

  const currentPhases = jsonpath.query(
    projects,
    `$..phases[?(${favorites.favoritePhases.map((p: number) => `@.id == ${p}`).join('||')})]`,
  );
  /*
  const currentProjects = projects.filter((project) => {
    return project.phases.find(phase => favorites.favoritePhases.includes(phase.id));
  });
  */
  return currentPhases;
};

const getWorktimes = async (dt?: string) => {
  dayjs.extend(isoWeek);

  const date = dayjs(dt);
  const weekly = await get(`worktimes/weekly?year=${date.format('YYYY')}&week=${date.isoWeek()}`);

  return weekly.worktimes.map((w: any) => ({
    id: w.id, phaseId: w.task.phaseId, taskId: w.taskId, date: w.date, duration: w.duration,
  }));
};

const getDefaultTaskFor = async (phaseId: string) => {
  const projects = await get('projects?active=true&userHasAccess=true');

  const defaultTasks = jsonpath.query(projects, `$..phases[?(@.id==${phaseId})].tasks[?(@.name=='No task')]`);

  if (defaultTasks && defaultTasks.length > 0) {
    return defaultTasks[0];
  }

  return {};
};

export const listPhases = async () => {
  const phases = await getCurrentPhases();

  printTable(phases.map((p) => ({id: p.id, name: p.name})));
};

export const listWeek = async () => {
  const weekdays = getWeekdays();

  const worktimes = await getWorktimes();
  const phases = await getCurrentPhases();

  const phasesForDays = phases.map(phase => {
    const phaseWeek: { [name: string]: string } = { 'Name': phase.name };
    weekdays.forEach(day => {
      const worktime = worktimes.find((w: any) => (w.date === day.date && w.phaseId === phase.id));
      if (worktime) {
        phaseWeek[day.name] = worktime.duration || 0;
      } else {
        phaseWeek[day.name] = '';
      }
    });
    return phaseWeek;
  });

  printTable(phasesForDays);
};

export const createWorktime = async (argv: any) => {
  const task = await getDefaultTaskFor(argv.id);
  const date = dayjs(argv.date).format('YYYY-MM-DD');

  const worktimes = await getWorktimes(argv.date);

  const worktime = worktimes.find((w: any) => (w.date === date && w.phaseId === argv.id));

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
