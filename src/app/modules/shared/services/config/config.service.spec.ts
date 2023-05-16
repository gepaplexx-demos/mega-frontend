import {TestBed} from '@angular/core/testing';

import {ConfigService} from './config.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Config} from '../../models/Config';
import {LocalStorageService} from '../local-storage/local-storage.service';

describe('ConfigService', () => {

  let configService: ConfigService;
  let httpTestingController: HttpTestingController;

  let localStorageService: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    configService = TestBed.inject(ConfigService);
    httpTestingController = TestBed.inject(HttpTestingController);
    localStorageService = TestBed.inject(LocalStorageService);
  });

  it('#should be created', () => {
    expect(configService).toBeTruthy();
  });

  it('#getConfig - should do http call and return config', (done) => {
    configService.getConfig()
      .subscribe(config => {
        expect(config).toEqual(ConfigMock.config);

        done();
      });

    const testRequest = httpTestingController.expectOne(configService.getBackendUrlWithContext('/config'));
    testRequest.flush(ConfigMock.config);
  });

  it('#getBackendUrl - should return backend url', () => {
    expect(configService.getBackendUrl()).toBeTruthy();
  });

  it('#getBackendUrlWithContext - should return backend url with context', () => {
    expect(configService.getBackendUrlWithContext(ConfigMock.context)).toContain(ConfigMock.context);
  });

  class ConfigMock {

    static frontendOriginSegment: number = 9876;
    static context: string = '/context/employee'

    static config: Config = {
      budgetCalculationExcelUrl: 'budgetCalculationExcelUrl',
      clientId: 'clientId',
      issuer: 'issuer',
      scope: 'scope',
      version: 'version',
      zepOrigin: 'zepOrigin'
    }
  }
});
