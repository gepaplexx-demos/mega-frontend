import {Component, OnDestroy, OnInit} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {authConfig, cypressAuthConfig} from './auth/auth.config';
import {Router} from '@angular/router';
import {UserService} from './modules/shared/services/user/user.service';
import {ConfigService} from './modules/shared/services/config/config.service';
import {firstValueFrom, Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {

  configServiceSubscription: Subscription;

  constructor(private router: Router,
              private oAuthService: OAuthService,
              private configService: ConfigService,
              private userService: UserService,
              private translate: TranslateService) {
    translate.addLangs(['de']);
    translate.setDefaultLang('de');
  }

  async ngOnInit(): Promise<void> {
    const config = await firstValueFrom(this.configService.getConfig());

    this.oAuthService.configure({
      clientId: config.clientId,
      issuer: config.issuer,
      scope: config.scope,
      // @ts-ignore
      ...(window.Cypress ? cypressAuthConfig : authConfig)
    });

    await this.oAuthService.loadDiscoveryDocumentAndTryLogin();
    this.oAuthService.setupAutomaticSilentRefresh();

    if (this.userService.loggedInWithGoogle()) {
      this.userService.loginUser();
    }
  }

  ngOnDestroy(): void {
    this.configServiceSubscription?.unsubscribe();
  }
}
