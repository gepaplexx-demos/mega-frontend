import {Injectable} from '@angular/core';
import {Employee} from '../../models/Employee';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../config/config.service';
import {EmployeeStep} from '../../models/EmployeeStep';
import {Step} from '../../models/Step';
import {State} from '../../models/State';
import {ProjectStep} from '../../models/ProjectStep';
import {UpdateEmployeeStep} from '../../models/UpdateEmployeeStep';

@Injectable({
  providedIn: 'root'
})
export class StepentriesService {

  constructor(
    private httpClient: HttpClient,
    private config: ConfigService
  ) {
  }

  close(employee: Employee, step: Step, currentMonthYear: string): Observable<boolean> {
    return this.httpClient.put<boolean>(
      this.config.getBackendUrlWithContext('/stepentry/close'),
      new EmployeeStep(step, employee, currentMonthYear)
    );
  }

  /**
   *
   * @return true if the operation was successful
   */
  updateEmployeeStateForOffice(employee: Employee, step: Step, currentMonthYear: string, newState: State, newStateReason?: string): Observable<boolean> {
    return this.httpClient.put<boolean>(
      this.config.getBackendUrlWithContext('/stepentry/updateEmployeeStateForOffice'),
      new UpdateEmployeeStep(step, employee, currentMonthYear, newState, newStateReason)
    );
  }

  /**
   *
   * @return true if the operation was successful
   */
  updateEmployeeStateForProject(employee: Employee, projectName: string, currentMonthYear: string, newState: State): Observable<boolean> {
    return this.httpClient.put<boolean>(
      this.config.getBackendUrlWithContext('/stepentry/updateEmployeeStateForProject'),
      new ProjectStep(Step.CONTROL_TIME_EVIDENCES, employee, projectName, currentMonthYear, newState)
    );
  }
}
