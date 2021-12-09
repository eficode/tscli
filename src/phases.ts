import assert from 'assert';
import { printTable } from 'console-table-printer';

import { get } from './api';

export interface Phase {
  id: number;
  name: string;
  projectName: string;
}

/**
 * Checks whether an input adheres to the type `Phase`
 * @param phase The input to be validated whether it is of type `Phase`
 * @returns True when the input is a valid instance of Phase, else false.
 */
export const isPhase = (phase: any): phase is Phase =>
  typeof phase === 'object' &&
  typeof phase.id === 'number' &&
  typeof phase.name === 'string' &&
  typeof phase.projectName === 'string';

/**
 * Retrieves all phases from a list of projects.
 * @param projects The projects input where to retrieve the phases from
 * @returns All phases in a project
 */
const projectsToPhases = (projects: any[]): Phase[] =>
  projects.flatMap((project) => {
    const projectPhases = project.phases;

    // Validate that the project contains an array of phases
    assert(Array.isArray(projectPhases));

    return (
      projectPhases
        // Transform each phase input into an object of type Phase
        .map((phase) => ({ id: phase.id, name: phase.name, projectName: project.name }))
        // Make sure that all phases we just created are valid instances of Phase
        .map((phase) => {
          assert(isPhase(phase));

          return phase;
        })
    );
  });

export const findPhases = async (id: number): Promise<Phase[] | null> => {
  const projects = await get('projects?active=true&userHasAccess=true');

  assert(Array.isArray(projects), 'Expected projects to be an array');

  const phases = projectsToPhases(projects);

  return phases.filter((phase) => phase.id === id);
};

export const getCurrentPhases = async (): Promise<Phase[]> => {
  const projects = await get('projects?active=true&userHasAccess=true');
  const favorites = await get('preferences/favoritePhases');

  assert(Array.isArray(projects), 'Expected projects to be an array');

  const phases = projectsToPhases(projects);

  return phases.filter((phase) => favorites.favoritePhases.includes(phase.id));
};

export const getPhaseIds = (phases: Phase[]): (number | undefined)[] => {
  return phases.map((phase) => phase.id);
};

export const listPhases = async (): Promise<void> => {
  const phases = await getCurrentPhases();

  printTable(
    phases.map((p: any) => ({ Name: p.projectName === p.name ? p.name : `${p.projectName} (${p.name})`, Id: p.id })),
  );
};
