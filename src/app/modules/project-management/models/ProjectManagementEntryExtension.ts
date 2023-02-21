import {ProjectManagementEntry} from './ProjectManagementEntry';

/**
 * extends ProjectManagementEntry by props which are needed for the view
 */
export interface ProjectManagementEntryExtension extends ProjectManagementEntry {
  allProjectCheckStatesDone?: boolean;
}
