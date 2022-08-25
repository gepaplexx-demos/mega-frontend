import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MonthlyReport} from '../../models/MonthlyReport';
import {State} from '../../../shared/models/State';
import * as _moment from 'moment';

const moment = _moment;

@Component({
  selector: 'app-display-monthly-report',
  templateUrl: './display-monthly-report.component.html',
  styleUrls: ['./display-monthly-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayMonthlyReportComponent implements OnInit {

  readonly State = State;

  @Input() monthlyReport: MonthlyReport;
  @Output() refreshMonthlyReport: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit() {
  }

  isValidDate(dateStr: string): boolean {
    const date = new Date(dateStr);
    return date.getTime() === date.getTime();
  }

  emitRefreshMonthlyReport() {
    this.refreshMonthlyReport.emit();
  }
}
