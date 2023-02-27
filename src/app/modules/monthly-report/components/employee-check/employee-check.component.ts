import {Component, EventEmitter, Inject, Input, LOCALE_ID, OnDestroy, OnInit, Output} from '@angular/core';
import {MonthlyReport} from '../../models/MonthlyReport';
import {CommentService} from '../../../shared/services/comment/comment.service';
import {State} from '../../../shared/models/State';
import {MatSelectionListChange} from '@angular/material/list';
import {StepentriesService} from '../../../shared/services/stepentries/stepentries.service';
import {Step} from '../../../shared/models/Step';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {PmProgressComponent} from '../../../shared/components/pm-progress/pm-progress.component';
import {MonthlyReportService} from '../../services/monthly-report.service';
import * as moment from 'moment';
import {convertMomentToString, toMonthYearString} from '../../../shared/utils/dateUtils';
import {Subscription, zip} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-employee-check',
  templateUrl: './employee-check.component.html',
  styleUrls: ['./employee-check.component.scss']
})
export class EmployeeCheckComponent implements OnInit, OnDestroy {

  State = State;

  @Input() monthlyReport: MonthlyReport;
  @Output() refreshMonthlyReport: EventEmitter<void> = new EventEmitter<void>();

  employeeProgressRef: MatBottomSheetRef;
  overlaysButton: boolean;
  public selectedDateStr;
  private dateSelectionSub: Subscription;

  constructor(
    public commentService: CommentService,
    private monthlyReportService: MonthlyReportService,
    public stepentriesService: StepentriesService,
    private bottomSheet: MatBottomSheet,
    @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit(): void {
    this.dateSelectionSub = zip(this.monthlyReportService.selectedYear, this.monthlyReportService.selectedMonth)
      .pipe(
        tap(value => {
          this.selectedDateStr = toMonthYearString(value[0], value[1], this.locale);
        })
      ).subscribe();
  }

  ngOnDestroy(): void {
    this.dateSelectionSub.unsubscribe();
  }

  selectionChange(change: MatSelectionListChange): void {
    const comment = change.options[0].value;

    this.commentService.setStatusDone(comment).subscribe(() => {
      const updatedComment = this.monthlyReport.comments.find(value => value.id === comment.id);
      updatedComment.state = State.DONE;

      const allCommentDone: boolean = this.monthlyReport.comments.every(c => c.state === State.DONE);
      if (allCommentDone) {
        this.emitRefreshMonthlyReport();
      }
    });
  }

  setOpenAndUnassignedStepEntriesDone(): void {
    const closeDate = moment()
      .year(this.monthlyReportService.selectedYear.value)
      .month(this.monthlyReportService.selectedMonth.value)
      .date(1)
      .startOf('day');

    this.stepentriesService
      .close(this.monthlyReport.employee, Step.CONTROL_TIMES, convertMomentToString(closeDate))
      .subscribe(() => {
        this.emitRefreshMonthlyReport();
      });
  }

  emitRefreshMonthlyReport(): void {
    this.refreshMonthlyReport.emit();
  }

  openEmployeeProgress($event?: MouseEvent): void {
    this.employeeProgressRef = this.bottomSheet.open(PmProgressComponent, {
      data: {
        employeeProgresses: this.monthlyReport.employeeProgresses,
        internalCheckState: this.monthlyReport.internalCheckState
      },
      autoFocus: false,
      hasBackdrop: false
    });
    const bottomSheetContainer = document.querySelector('mat-bottom-sheet-container');
    const bottomSheetY = window.innerHeight - bottomSheetContainer?.getBoundingClientRect()?.height || 0;

    const eventY = $event?.y || 0;

    this.overlaysButton = bottomSheetY < (eventY + 10); // inaccuracy correction

    bottomSheetContainer?.addEventListener('mouseleave', () => {
      this.employeeProgressRef.dismiss();
      this.overlaysButton = false;
    });
  }

  closeEmployeeProgress(): void {
    if (!this.overlaysButton) {
      this.employeeProgressRef.dismiss();
    }
  }

  parseBody(body: string): string {
    const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/igm;
    return body.replace(urlPattern, '<a href=\$& target="_blank"\>$&</a>');
  }
}
