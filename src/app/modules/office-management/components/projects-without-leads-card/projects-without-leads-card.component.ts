import { Component, OnInit } from '@angular/core';
import {ProjectManagementService} from '../../../project-management/services/project-management.service';
import {finalize, tap} from 'rxjs';
import {CustomerProjectWithoutLeads} from '../../../shared/models/CustomerProjectWithoutLeads';

@Component({
  selector: 'app-projects-without-leads-card',
  templateUrl: './projects-without-leads-card.component.html',
  styleUrls: ['./projects-without-leads-card.component.scss']
})
export class ProjectsWithoutLeadsCardComponent implements OnInit {

  constructor(private pmService: ProjectManagementService) { }

  public projectsWithoutLeads: CustomerProjectWithoutLeads[];
  public isLoading = false;
  public displayedColumns = ['name', 'comment'];

  ngOnInit(): void {
    this.pmService.getProjectsWithoutLeads()
      .pipe(
        tap(() => this.isLoading = true),
        finalize(() => this.isLoading = false)
      )
      .subscribe(projects => this.projectsWithoutLeads = projects);
  }
}
