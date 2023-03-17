import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Config} from '../../../shared/models/Config';
import {ConfigService} from '../../../shared/services/config/config.service';
import {configuration} from '../../../shared/constants/configuration';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-projekt-name-with-zep-link',
  templateUrl: './projekt-name-with-zep-link.component.html',
  styleUrls: ['./projekt-name-with-zep-link.component.scss']
})
export class ProjektNameWithZepLinkComponent implements OnInit, OnDestroy {
  @Input() projectName: string;
  @Input() zepId: number;

  projectManagementUrl: string;
  private configServiceSubscription: Subscription;

  constructor(private configService: ConfigService) { }

  ngOnInit(): void {
    this.configServiceSubscription = this.configService.getConfig().subscribe((config: Config) => {
      this.projectManagementUrl = config.zepOrigin + '/' + configuration.PROJECT_MANAGEMENT_SEGMENT;
    });
  }

  ngOnDestroy(): void {
    this.configServiceSubscription.unsubscribe();
  }

}
