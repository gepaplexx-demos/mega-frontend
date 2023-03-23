import {Component, Inject, OnInit} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {
  EmployeeCheckConfirmDialogAction,
  EmployeeCheckConfirmDialogActionType
} from './model/EmployeeCheckConfirmDialogAction';
import {EmployeeCheckConfirmDialogData} from './model/EmployeeCheckConfirmDialogData';

@Component({
  selector: 'app-employee-check-confirm-comment-dialog',
  templateUrl: './employee-check-confirm-comment-dialog.component.html',
  styleUrls: ['./employee-check-confirm-comment-dialog.component.scss']
})
export class EmployeeCheckConfirmCommentDialogComponent implements OnInit {
  textAreaInp;

  isEdit;
  MAX_LENGTH = 500;

  constructor(private dialogRef: MatDialogRef<EmployeeCheckConfirmCommentDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: EmployeeCheckConfirmDialogData) {
  }

  ngOnInit(): void {
    this.textAreaInp = this.data?.reason || '';

    // if reason not empty -> isEdit true
    this.isEdit = !!this.data?.reason;
  }

  save() {
    const result: EmployeeCheckConfirmDialogAction = {
      type: EmployeeCheckConfirmDialogActionType.SAVE,
      payload: this.textAreaInp
    }

    this.dialogRef.close(result);
  }

  cancel() {
    const result: EmployeeCheckConfirmDialogAction = {
      type: EmployeeCheckConfirmDialogActionType.CANCEL,
      payload: null
    }

    this.dialogRef.close(result);
  }
}
