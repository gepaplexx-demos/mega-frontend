import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MonthlyReport} from '../../models/MonthlyReport';
import {TranslateService} from "@ngx-translate/core";
import {Moment} from "moment/moment";
import {MonthlyReportService} from "../../services/monthly-report.service";
import * as _moment from 'moment';
import {Subscription, zip} from "rxjs";
import {tap} from "rxjs/operators";

const moment = _moment;

@Component({
  selector: 'app-information-top-bar',
  templateUrl: './information-top-bar.component.html',
  styleUrls: ['./information-top-bar.component.scss']
})
export class InformationTopBarComponent implements OnInit {

  @Input() monthlyReport: MonthlyReport;
  @Output() refreshMonthlyReport: EventEmitter<void> = new EventEmitter<void>();

  employeeFunctions: string;

  maxMonthDate = 0;
  selectedYear: number;
  selectedMonth: number;
  dateSelectionSub: Subscription;

  constructor(private translateService: TranslateService,
              private monthlyReportService: MonthlyReportService) {
  }

  ngOnInit(): void {
    this.translateService.get('EMPLOYEE_FUNCTIONS').subscribe(funcs => this.employeeFunctions = funcs);

    this.dateSelectionSub = zip(this.monthlyReportService.selectedYear, this.monthlyReportService.selectedMonth)
      .pipe(
        tap(value => {
          this.selectedYear = value[0];
          this.selectedMonth = value[1] + 1;
        })
      ).subscribe();
  }

  dateChanged(date: Moment) {
    this.monthlyReportService.selectedYear.next(moment(date).year());
    this.monthlyReportService.selectedMonth.next(moment(date).month());
    this.emitRefreshMonthlyReport();
  }

  get date() {
    return moment()
      .year(this.selectedYear)
      .month(this.selectedMonth)
      .date(1)
      .startOf('day');
  }

  emitRefreshMonthlyReport() {
    this.refreshMonthlyReport.emit();
  }

}
