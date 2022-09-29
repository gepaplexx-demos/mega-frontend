import {TestBed} from '@angular/core/testing';

import {LocalStorageService} from './local-storage.service';
import {Config} from '../../models/Config';
import {expect} from '@angular/flex-layout/_private-utils/testing';

describe('LocalStorageService', () => {

  let localStorageService: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    localStorageService = TestBed.inject(LocalStorageService);
  });

  it('#should be created', () => {
    expect(localStorageService).toBeTruthy();
  });

  it('#userStartPage - should save userStartPage', () => {
    localStorageService.saveUserStartPage(ConfigMock.userStartPage);

    const userStartPage = localStorageService.getUserStartPage();

    expect(userStartPage).toBeTruthy();
  });

  it('#userStartPage - should remove userStartPage', () => {
    localStorageService.saveUserStartPage(ConfigMock.userStartPage);

    let userStartPage = localStorageService.getUserStartPage();

    expect(userStartPage).toBeTruthy();

    localStorageService.removeUserStartPage();

    userStartPage = localStorageService.getUserStartPage();
    expect(userStartPage).toBeFalsy();
  });

  class ConfigMock {

    static userStartPage: string = '/home'

    static config: Config = {
      budgetCalculationExcelUrl: 'budgetCalculationExcelUrl',
      clientId: 'clientId',
      excelUrl: 'excelUrl',
      issuer: 'issuer',
      scope: 'scope',
      version: 'version',
      zepOrigin: 'zepOrigin'
    }
  }
});
