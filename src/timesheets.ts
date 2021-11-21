import dayjs from 'dayjs';
import jsonpath from 'jsonpath';

import { get, post } from './api';

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

  phases.map((p) => {
    console.log(`${p.id.toString().padEnd(10)}${p.name}`);
  });
};

export const createWorktime = async (argv: any) => {
  const task = await getDefaultTaskFor(argv.id);
  const date = argv.date || dayjs().format('YYYY-MM-DD');

  try {
    if (date && task.id) {
      const worktime = await post('worktimes', {
        date,
        taskId: task.id,
        duration: argv.duration.toString(),
        description: argv.description,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
