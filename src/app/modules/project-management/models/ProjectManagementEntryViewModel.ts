import {ProjectManagementEntry} from './ProjectManagementEntry';

/**
 * extends ProjectManagementEntry by props which are needed for the view
 */
export interface ProjectManagementEntryViewModel extends ProjectManagementEntry {
  allProjectCheckStatesDone?: boolean;
}
