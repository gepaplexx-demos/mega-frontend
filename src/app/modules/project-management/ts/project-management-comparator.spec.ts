import {ProjectManagementEntryExtension} from '../models/ProjectManagementEntryExtension';
import {ProjectState} from '../../shared/models/ProjectState';
import {comparePmEntriesFn} from './project-management-comparator';

function createTestProjectManagementEntity(projectName: string): ProjectManagementEntryExtension;
function createTestProjectManagementEntity(projectName: string, allProjectCheckStatesDone?: boolean): ProjectManagementEntryExtension;
function createTestProjectManagementEntity(projectName: string, allProjectCheckStatesDone?: boolean, controlProjectState?: ProjectState): ProjectManagementEntryExtension;
function createTestProjectManagementEntity(projectName: string, allProjectCheckStatesDone?: boolean, controlProjectState?: ProjectState, controlBillingState?: ProjectState): ProjectManagementEntryExtension;
function createTestProjectManagementEntity(projectName: string, allProjectCheckStatesDone?: boolean, controlProjectState?: ProjectState, controlBillingState?: ProjectState): ProjectManagementEntryExtension {
  return {
    projectName: projectName,
    allProjectCheckStatesDone: allProjectCheckStatesDone,
    entries: [],
    controlProjectState: controlProjectState || ProjectState.DONE,
    controlBillingState: controlBillingState || ProjectState.DONE,
    presetControlProjectState: false,
    presetControlBillingState: false,
    projectComment: undefined,
    aggregatedBillableWorkTimeInSeconds: 0,
    aggregatedNonBillableWorkTimeInSeconds: 0
  }
}

function getProjectNames(entities: ProjectManagementEntryExtension[]) {
  return entities.map(e => e.projectName);
}

describe('ProjectManagementComparator', () => {

  it('should order by projectName alphabetically asc', () => {

    // given
    const input: ProjectManagementEntryExtension[] = [
      createTestProjectManagementEntity('B'),
      createTestProjectManagementEntity('AAC'),
      createTestProjectManagementEntity('GH'),
      createTestProjectManagementEntity('AAA'),
      createTestProjectManagementEntity('XYZ'),
      createTestProjectManagementEntity('AAB')
    ];

    const expectedSortOrder = [
      'AAA',
      'AAB',
      'AAC',
      'B',
      'GH',
      'XYZ',
    ];

    // when
    input.sort(comparePmEntriesFn).reverse();

    // then
    expectedSortOrder.forEach((val, index) => expect(val).toEqual(input[index].projectName));
  });

  it('should order by allProjectCheckStatesDone before alphabetical', () => {

    // given
    const input: ProjectManagementEntryExtension[] = [
      createTestProjectManagementEntity('B', true),
      createTestProjectManagementEntity('AAC', true),
      createTestProjectManagementEntity('GH', false),
      createTestProjectManagementEntity('AAA', true),
      createTestProjectManagementEntity('XYZ', false),
      createTestProjectManagementEntity('AAB', true)
    ];

    const expectedSortOrder = [
      'GH',
      'XYZ',
      'AAA',
      'AAB',
      'AAC',
      'B'
    ];

    // when
    input.sort(comparePmEntriesFn).reverse();

    // then
    expectedSortOrder.forEach((val, index) => expect(val).toEqual(input[index].projectName));
  });

  it('should order by controlProjectState before alphabetical', () => {

    // given
    const input: ProjectManagementEntryExtension[] = [
      createTestProjectManagementEntity('AAC', true),
      createTestProjectManagementEntity('GH', true),
      createTestProjectManagementEntity('FIRST', true, ProjectState.WORK_IN_PROGRESS),
      createTestProjectManagementEntity('SECOND', true, ProjectState.OPEN),
      createTestProjectManagementEntity('AAA', true),
      createTestProjectManagementEntity('XYZ', true),
      createTestProjectManagementEntity('DONE', true, ProjectState.DONE),
      createTestProjectManagementEntity('NOT_RELEVANT', true, ProjectState.NOT_RELEVANT),
      createTestProjectManagementEntity('AAB', true)
    ];

    const expectedSortOrder = [
      'FIRST',
      'SECOND',
      'AAA',
      'AAB',
      'AAC',
      'DONE',
      'GH',
      'NOT_RELEVANT',
      'XYZ',
    ];

    // when
    input.sort(comparePmEntriesFn).reverse();

    // then
    expectedSortOrder.forEach((val, index) => expect(val).toEqual(input[index].projectName));
  });

  it('should order by controlBillingState before alphabetical', () => {

    // given
    const input: ProjectManagementEntryExtension[] = [
      createTestProjectManagementEntity('AAC', true),
      createTestProjectManagementEntity('GH', true),
      createTestProjectManagementEntity('FIRST', true, undefined, ProjectState.WORK_IN_PROGRESS),
      createTestProjectManagementEntity('SECOND', true, undefined, ProjectState.OPEN),
      createTestProjectManagementEntity('NOT_RELEVANT', true, undefined, ProjectState.NOT_RELEVANT),
      createTestProjectManagementEntity('DONE', true, undefined, ProjectState.DONE),
      createTestProjectManagementEntity('AAA', true),
      createTestProjectManagementEntity('XYZ', true),
      createTestProjectManagementEntity('AAB', true)
    ];

    const expectedSortOrder = [
      'FIRST',
      'SECOND',
      'AAA',
      'AAB',
      'AAC',
      'DONE',
      'GH',
      'NOT_RELEVANT',
      'XYZ',
    ];

    // when
    input.sort(comparePmEntriesFn).reverse();

    // then
    expectedSortOrder.forEach((val, index) => expect(val).toEqual(input[index].projectName));
  });

  it('should order correctly by all criteria', () => {

    // given
    const input: ProjectManagementEntryExtension[] = [
      createTestProjectManagementEntity('XYZ', true),
      createTestProjectManagementEntity('GH', true),
      createTestProjectManagementEntity('AAC', true),
      createTestProjectManagementEntity('FIRST', true, undefined, ProjectState.WORK_IN_PROGRESS),
      createTestProjectManagementEntity('SECOND', false),
      createTestProjectManagementEntity('THIRD', true, ProjectState.OPEN),
      createTestProjectManagementEntity('AAB', true)
    ];

    const expectedSortOrder = [
      'FIRST',
      'SECOND',
      'THIRD',
      'AAB',
      'AAC',
      'GH',
      'XYZ',
    ];

    // when
    input.sort(comparePmEntriesFn).reverse();

    // then
    expectedSortOrder.forEach((val, index) => expect(val).toEqual(input[index].projectName));
  });
});
