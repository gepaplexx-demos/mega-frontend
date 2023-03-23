import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {StateSelectComponent} from './state-select.component';
import {TranslateModule} from '@ngx-translate/core';
import {AngularMaterialModule} from '../../../material/material-module';
import {By} from '@angular/platform-browser';
import {MatLegacySelect as MatSelect} from '@angular/material/legacy-select';
import {State} from '../../models/State';

describe('StateSelectComponent', () => {

  let fixture: ComponentFixture<StateSelectComponent>;
  let component: StateSelectComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        StateSelectComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        AngularMaterialModule
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(StateSelectComponent);
      component = fixture.componentInstance;
    });
  }));

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#afterViewChecked - should have called cdr.detectChanges()', () => {
    fixture.detectChanges();

    const spy = spyOn((component as any).cdr, 'detectChanges');
    component.ngAfterViewChecked();

    expect(spy).toHaveBeenCalled();
  });

  it('#onSelectionChange - should change value', () => {
    fixture.detectChanges();

    const select = fixture.debugElement.query(By.directive(MatSelect));
    select.triggerEventHandler('selectionChange', {value: State.DONE});

    fixture.detectChanges();
    expect(component.value).toEqual(State.DONE);
  })
});
