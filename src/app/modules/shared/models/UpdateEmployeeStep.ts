import {Employee} from './Employee';
import {State} from './State';

export class UpdateEmployeeStep {

  stepId: number;
  employee: Employee;
  currentMonthYear: string;
  newState: State;

  constructor(stepId: number, employee: Employee, currentMonthYear: string, newState: State) {
    this.stepId = stepId;
    this.employee = employee;
    this.currentMonthYear = currentMonthYear;
    this.newState = newState;
  }
}
