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
import {MatDialog} from '@angular/material/dialog';
import {
  EmployeeCheckConfirmCommentDialogComponent
} from '../employee-check-confirm-comment-dialog/employee-check-confirm-comment-dialog.component';
import {
  EmployeeCheckConfirmDialogAction,
  EmployeeCheckConfirmDialogActionType
} from '../employee-check-confirm-comment-dialog/ts/EmployeeCheckConfirmDialogAction';

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
    @Inject(LOCALE_ID) private locale: string,
    private dialog: MatDialog) {
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
    const closeDate = this.getSelectedDate();

    this.stepentriesService
      .close(this.monthlyReport.employee, Step.CONTROL_TIMES, convertMomentToString(closeDate))
      .subscribe(() => {
        this.emitRefreshMonthlyReport();
      });
  }

  private getSelectedDate() {
    return moment()
      .year(this.monthlyReportService.selectedYear.value)
      .month(this.monthlyReportService.selectedMonth.value)
      .date(1)
      .startOf('day');
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

  public openStateInProgressReasonDialog() {
    const dialogRef = this.dialog.open(EmployeeCheckConfirmCommentDialogComponent,
      {
        data: {
          reason: this.monthlyReport?.employeeCheckStateReason
        },
        width: '100%',
        autoFocus: false
      }
    );

    dialogRef.afterClosed().subscribe((result: EmployeeCheckConfirmDialogAction) => {
      if(result.type === EmployeeCheckConfirmDialogActionType.SAVE) {
        const input = result.payload as string;

        const date = this.getSelectedDate();

        this.stepentriesService
          .updateEmployeeStateForOffice(this.monthlyReport.employee, Step.CONTROL_TIMES, convertMomentToString(date), State.IN_PROGRESS, input)
          .subscribe(() => {
            this.emitRefreshMonthlyReport();
          });
      }
    });
  }

  public resetState() {
    const date = this.getSelectedDate();

    this.stepentriesService
      .updateEmployeeStateForOffice(this.monthlyReport.employee, Step.CONTROL_TIMES, convertMomentToString(date), State.OPEN, null)
      .subscribe(() => {
        this.emitRefreshMonthlyReport();
      });
  }
}
