import {Component, Input} from '@angular/core';
import {MonthlyReport} from '../../models/MonthlyReport';
import {State} from '../../../shared/models/State';
import {TimeWarning} from '../../models/TimeWarning';

@Component({
  selector: 'app-time-check',
  templateUrl: './time-check.component.html',
  styleUrls: ['./time-check.component.scss']
})
export class TimeCheckComponent {

  State = State;

  @Input() monthlyReport: MonthlyReport;

  displayedColumns = ['date', 'description'];

   emptyTimeWarnings: TimeWarning = {
    date: '',
    description: ['Keine Einträge']
  };

  getSortedTimeWarnings() {
    if (this.monthlyReport.timeWarnings.length === 0) {
      return [this.emptyTimeWarnings];
    }

    return this.monthlyReport.timeWarnings.sort((a, b) => Date.parse(a.date).valueOf() - Date.parse(b.date).valueOf());
  }
}
