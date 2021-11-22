import { printTable } from 'console-table-printer';

import { get } from './api';

export const getCurrentPhases = async () => {
  const projects = await get('projects?active=true&userHasAccess=true');
  const favorites: any = await get('preferences/favoritePhases');
/*
  const currentPhases = jsonpath.query(
    projects,
    `$..phases[?(${favorites.favoritePhases.map((p: number) => `@.id == ${p}`).join('||')})]`,
  );
*/
  const currentPhases = projects.map((project: any) => {
    const phases = project.phases
      .map((phase: any) => favorites.favoritePhases.includes(phase.id) ? phase : null)
      .filter((x: any) => x);

    if (phases) {
      return phases.map((phase: any) => ({ id: phase.id, name: phase.name, projectName: project.name }));
    }

    return null;
  }).filter((x: any) => x).flat();

  return currentPhases;
};

export const listPhases = async () => {
  const phases = await getCurrentPhases();

  printTable(phases.map((p: any) => ({ Id: p.id, Name: (p.projectName === p.name ? p.name : `${p.projectName} (${p.name})`) })));
};
