import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EmployeeCheckConfirmDialogAction, EmployeeCheckConfirmDialogActionType} from './ts/EmployeeCheckConfirmDialogAction';
import {EmployeeCheckConfirmDialogData} from './ts/EmployeeCheckConfirmDialogData';

@Component({
  selector: 'app-employee-check-confirm-comment-dialog',
  templateUrl: './employee-check-confirm-comment-dialog.component.html',
  styleUrls: ['./employee-check-confirm-comment-dialog.component.scss']
})
export class EmployeeCheckConfirmCommentDialogComponent implements OnInit {
  public textAreaInp;

  public isEdit;
  public MAX_LENGTH = 500;

  constructor(private dialogRef: MatDialogRef<EmployeeCheckConfirmCommentDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: EmployeeCheckConfirmDialogData) { }

  ngOnInit(): void {
    this.textAreaInp = this.data?.reason || '';

    // if reason not empty -> isEdit true
    this.isEdit = !!this.data?.reason;

  }

  public save() {
    const result: EmployeeCheckConfirmDialogAction = {
      type: EmployeeCheckConfirmDialogActionType.SAVE,
      payload: this.textAreaInp
    }

    this.dialogRef.close(result);
  }

  public cancel() {
    const result: EmployeeCheckConfirmDialogAction = {
      type: EmployeeCheckConfirmDialogActionType.CANCEL,
      payload: null
    }

    this.dialogRef.close(result);
  }

}
