export interface TimeWarning {
  date: string;
  missingRestTime: number;
  missingBreakTime: number;
  excessWorkTime: number;
  warnings: Array<string>;
}
