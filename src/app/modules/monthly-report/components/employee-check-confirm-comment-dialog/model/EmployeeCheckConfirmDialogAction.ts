export enum EmployeeCheckConfirmDialogActionType {
  SAVE,
  CANCEL
}

export interface EmployeeCheckConfirmDialogAction {
  type: EmployeeCheckConfirmDialogActionType;
  payload: string;
}
