import { printTable } from 'console-table-printer';

import { get } from './api';

export const findPhases = async (id: number) => {
  const projects = await get('projects?active=true&userHasAccess=true');

  const phases = projects
    .map((project: any) => {
      const filteredPhases = project.phases.filter((phase: any) => id === phase.id);

      if (filteredPhases) {
        return filteredPhases.map((phase: any) => ({ id: phase.id, name: phase.name, projectName: project.name }));
      }

      return null;
    })
    .filter((x: any) => x)
    .flat();

  return phases;
};

export const getCurrentPhases = async () => {
  const projects = await get('projects?active=true&userHasAccess=true');
  const favorites: any = await get('preferences/favoritePhases');

  const currentPhases = projects
    .map((project: any) => {
      const phases = project.phases
        .map((phase: any) => (favorites.favoritePhases.includes(phase.id) ? phase : null))
        .filter((x: any) => x);

      if (phases) {
        return phases.map((phase: any) => ({ id: phase.id, name: phase.name, projectName: project.name }));
      }

      return null;
    })
    .filter((x: any) => x)
    .flat();

  return currentPhases;
};

export const getPhaseIds = (phases: any) => {
  return phases.map((phase: any) => phase.id);
};

export const listPhases = async () => {
  const phases = await getCurrentPhases();

  printTable(
    phases.map((p: any) => ({ Name: p.projectName === p.name ? p.name : `${p.projectName} (${p.name})`, Id: p.id })),
  );
};
