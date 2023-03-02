import {configuration} from '../constants/configuration';
import * as _moment from 'moment/moment';


const moment = _moment;

export function convertMomentToString(date: moment.Moment) {
  return date?.format(configuration.dateFormat);
}

/**
 * month 1, year 2023 results to [month-name by locale settings] 2023
 * e.g. Jänner 2023 in 'de-At'
 */
export function toMonthYearString(year: number, month: number, locale: string) {
  return `${toMonthStr(month, locale)} ${year}`
}

export function toMonthStr(month: number, locale: string): string {
  return moment().locale(locale).month(month).format('MMMM');
}
