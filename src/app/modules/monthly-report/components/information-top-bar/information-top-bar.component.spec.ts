import {ComponentFixture, fakeAsync, flush, TestBed} from '@angular/core/testing';
import * as _moment from 'moment';
import {InformationTopBarComponent} from './information-top-bar.component';
import {MonthlyReportService} from '../../services/monthly-report.service';
import {TranslateModule} from "@ngx-translate/core";
import {SharedModule} from "../../../shared/shared.module";

const moment = _moment;

describe('InformationTopBarComponent', () => {
  let component: InformationTopBarComponent;
  let fixture: ComponentFixture<InformationTopBarComponent>;

  let monthlyReportService: MonthlyReportService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformationTopBarComponent],
      imports: [
        TranslateModule.forRoot(),
        SharedModule
      ]
    })
      .compileComponents().then(() => {
          fixture = TestBed.createComponent(InformationTopBarComponent);
          component = fixture.componentInstance;

          monthlyReportService = TestBed.inject(MonthlyReportService);
        }
      );
  });

  beforeEach(() => {

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getDate - should selected date with day of month 1', () => {
    fixture.detectChanges();

    component.selectedMonth = DateMock.month;
    component.selectedYear = DateMock.year;

    expect(component.date).toEqual(moment().year(DateMock.year).month(DateMock.month).date(1).startOf('day'));
  });

  it('#dateChanged - should call monthlyReportService.selectedYear.next and monthlyReportService.selectedMonth.next', fakeAsync(() => {
    fixture.detectChanges();

    spyOn(monthlyReportService.selectedYear, 'next').and.stub();
    spyOn(monthlyReportService.selectedMonth, 'next').and.stub();

    component.dateChanged(moment());
    flush();

    expect(monthlyReportService.selectedYear.next).toHaveBeenCalled();
    expect(monthlyReportService.selectedMonth.next).toHaveBeenCalled();
  }));

  it('#emitRefreshMonthlyReport - should call emit', () => {
    fixture.detectChanges();

    spyOn(component.refreshMonthlyReport, 'emit').and.stub();

    component.emitRefreshMonthlyReport();

    expect(component.refreshMonthlyReport.emit).toHaveBeenCalled();
  });

  class DateMock {
    static month = 1;
    static year = 2020;
  }
});
