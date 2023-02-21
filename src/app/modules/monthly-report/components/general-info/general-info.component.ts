import {Component, Inject, Input, LOCALE_ID, OnChanges, SimpleChanges} from '@angular/core';
import {MonthlyReport} from '../../models/MonthlyReport';
import {MonthlyReportService} from '../../services/monthly-report.service';
import * as _moment from 'moment';
import {GeneralInfoData} from '../../models/GeneralInfoData';

const moment = _moment;

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnChanges {

  @Input() monthlyReport: MonthlyReport;

  displayedColumns = ['description', 'value', 'unit'];

  constructor(public monthlyReportService: MonthlyReportService, @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.monthlyReport) {
      this.calculateDynamicValue();
    }
  }

  calculateBillingPercentage(totalWorkingTime: string, billableTime: string): number {
    const spTotalWorkingTime: string[] = totalWorkingTime.split(':');
    const spBillableTime: string[] = billableTime.split(':');

    // if split is not possible return 0
    if (spTotalWorkingTime.length <= 1 || spBillableTime.length <= 1) {
      return 0;
    }

    this.monthlyReportService.totalWorkingTimeHours = ((+spTotalWorkingTime[0] * 60) + (+spTotalWorkingTime[1])) / 60;
    this.monthlyReportService.billableTimeHours = ((+spBillableTime[0] * 60) + (+spBillableTime[1])) / 60;

    // prevent division by zero
    if (this.monthlyReportService.totalWorkingTimeHours === 0 || this.monthlyReportService.billableTimeHours === 0) {
      return 0;
    }

    return (this.monthlyReportService.billableTimeHours / this.monthlyReportService.totalWorkingTimeHours) * 100;
  }

  month(yearmonth: number): string {
    return moment().locale(this.locale).month(yearmonth).format('MMMM');
  }

  calculateDynamicValue() {
    if (this.monthlyReport) {
      this.monthlyReportService.billablePercentage = this.calculateBillingPercentage(this.monthlyReport.totalWorkingTime
        , this.monthlyReport.billableTime);
    }
  }

  toGeneralInfoData(): GeneralInfoData[] {
    return [
      {
        description: 'monthly-report.generalInfo.workingTime',
        unit: 'monthly-report.generalInfo.hour',
        value: this.monthlyReportService.totalWorkingTimeHours
      },
      {
        description: 'monthly-report.generalInfo.chargeableHours',
        unit: 'monthly-report.generalInfo.hour',
        value: this.monthlyReportService.billableTimeHours
      },
      {
        description: 'monthly-report.generalInfo.chargeability',
        unit: 'monthly-report.generalInfo.percentage',
        value: this.monthlyReportService.billablePercentage
      },
      {
        description: 'monthly-report.generalInfo.vacation',
        unit: 'monthly-report.generalInfo.day',
        value: this.monthlyReport.vacationDays
      },
      {
        description: 'monthly-report.generalInfo.timeCompensation',
        unit: 'monthly-report.generalInfo.day',
        value: this.monthlyReport.compensatoryDays
      },
      {
        description: 'monthly-report.generalInfo.homeoffice',
        unit: 'monthly-report.generalInfo.day',
        value: this.monthlyReport.homeofficeDays
      },
      {
        description: 'monthly-report.generalInfo.paidSickLeave',
        unit: 'monthly-report.generalInfo.day',
        value: this.monthlyReport.paidSickLeave
      }
    ];
  }
}
