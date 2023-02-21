import {booleanCompare, stringCompare} from '../../shared/utils/compareUtils';
import {ProjectManagementEntryExtension} from '../models/ProjectManagementEntryExtension';
import {ProjectState} from '../../shared/models/ProjectState';

/**
 * Die Projekte sollen wie folgt sortiert werden:
 * Projekte, bei denen etwas zutun ist, sollen vor projekte, bei denen nichts zutun ist, sein, sprich "TodoProject" > "Project"
 * Ein Project ist ein "TodoProject", sobald eines der folgenden Kriterien zutrifft:
 *     - Mitarbeiter Überprüfung nicht fertig
 *     - Projectcontrolling Status ist 'Offen' oder 'In Arbeit'
 *     - Projectbilling Status ist 'Offen' oder 'In Arbeit'
 * Danach soll erst nach den Projektnamen alphabetisch aufsteigend sortiert werden (AAA vor BBB)
 *
 *
 * !!! AUFRUFER MUSS SORT().REVERSE aufrufen, weil javascript standardmäßig asc sortiert und hier die logik quasi invertiert ist !!!
 */
export function comparePmEntriesFn(a: ProjectManagementEntryExtension, b: ProjectManagementEntryExtension) {
  const isTodoA = isTodoProject(a);
  const isTodoB = isTodoProject(b);


  return booleanCompare(isTodoA, isTodoB)
    || stringCompare(b.projectName, a.projectName); // reversed -> DESC order -> AAA > BBB
}

const todoProjectStates = [ProjectState.OPEN, ProjectState.WORK_IN_PROGRESS];

function isTodoProject(project: ProjectManagementEntryExtension) {
  return !project.allProjectCheckStatesDone
    || todoProjectStates.includes(project.controlProjectState)
    || todoProjectStates.includes(project.controlBillingState);
}
