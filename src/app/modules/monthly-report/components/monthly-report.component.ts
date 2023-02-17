import {Component, OnInit} from '@angular/core';
import {MonthlyReport} from '../models/MonthlyReport';
import {Subscription} from 'rxjs';
import {MonthlyReportService} from '../services/monthly-report.service';
import * as moment from 'moment';

@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.scss']
})
export class MonthlyReportComponent implements OnInit {

  public monthlyReport: MonthlyReport;
  private monthlyReportSubscription: Subscription;

  constructor(private monthlyReportService: MonthlyReportService) {
  }

  ngOnInit(): void {
    this.getAllTimeEntries();
  }

  getAllTimeEntriesByDate(year: number, month: number): void {
    this.monthlyReportSubscription = this.monthlyReportService.getAllByDate(year, month).subscribe((monthlyReport: MonthlyReport) => {
      this.monthlyReport = monthlyReport;
    });
  }

  getAllTimeEntries(): void {
    this.monthlyReportSubscription = this.monthlyReportService.getAll().subscribe((monthlyReport: MonthlyReport) => {
      if (monthlyReport) {
        this.monthlyReport = monthlyReport;

        // moment().add berücksichtigt jahreswechsel (z.B. Dec 2022 + 1 Monat = Jan 2023)
        const dateOfNextMonth = moment(this.monthlyReport.employee.releaseDate).add(1, 'month');
        this.monthlyReportService.selectedYear.next(dateOfNextMonth.year());
        this.monthlyReportService.selectedMonth.next(dateOfNextMonth.month());
      }
    });
  }

  refreshMonthlyReport(): void {
    // trigger skeleton loaders
    this.monthlyReport = null;
    this.getAllTimeEntriesByDate(this.monthlyReportService.selectedYear.getValue(), this.monthlyReportService.selectedMonth.getValue());
  }
}
