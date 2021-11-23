import { printTable } from 'console-table-printer';

import { get, put } from './api';

import { findPhases, getPhaseIds, getCurrentPhases } from '../src/phases';

const searchProjects = async (keyword: any) => {
  if (!keyword) {
    return [];
  }

  const projects = await get('projects?active=true&userHasAccess=true');

  const found = projects
    .map((project: any) => {
      var regex = new RegExp(keyword, 'i');

      const phases = project.phases
        .filter((phase: any) => (project.name.match(regex) || phase.name.match(regex)));

      if (phases) {
        return phases.map((phase: any) => ({ id: phase.id, name: phase.name, projectName: project.name }));
      }

      return null;
    })
    .filter((x: any) => x)
    .flat();

  return found;
};

const addFavorite = async (id: any) => {
  const currentPhases = await getCurrentPhases();
  const phases = await getPhaseIds(currentPhases);

  if (!phases.includes(id)) {
    phases.push(id);

    await put('preferences/favoritePhases', { preferences: phases });

    return true;
  }

  return false;
};

const removeFavorite = async (id: any) => {
  const currentPhases = await getCurrentPhases();
  const allPhases = await getPhaseIds(currentPhases);

  const removedPhases = allPhases.filter((phase: any) => phase !== id);

  if (removedPhases.length < allPhases.length) {
    await put('preferences/favoritePhases', { preferences: removedPhases });

    return true;
  }

  return false;
};

export const findProjectsAndTasks = async (argv: any) => {
  if (!argv.name) {
    console.log('Please provide a project or tasks name to search for');
    return [];
  }

  const projects = await searchProjects(argv.name);

  printTable(
    projects.map((p: any) => ({ Id: p.id, Name: p.projectName === p.name ? p.name : `${p.projectName} (${p.name})` })),
  );
};

export const changeFavorite = async (argv: any) => {
  if (!argv.id) {
    console.log('Please provide a project or tasks name to search for');
  }

  const phases = await findPhases(argv.id);
  const favorites = await getPhaseIds(await getCurrentPhases());

  if (phases && phases.length > 0) {
    if (favorites.includes(phases[0].id) && argv.action === 'rm') {
      removeFavorite(phases[0].id);
      console.log('Task removed from favorites');
    }

    if (!favorites.includes(phases[0].id) && argv.action === 'add') {
      addFavorite(phases[0].id);
      console.log('Task added to favorites');
    }
  }
};
