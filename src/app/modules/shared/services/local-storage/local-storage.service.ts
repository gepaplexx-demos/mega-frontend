import {Injectable} from '@angular/core';
import {Config} from '../../models/Config';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private megaUserStartPage = 'MEGA_USER_STARTPAGE';

  getUserStartPage(): string {
    return localStorage.getItem(this.megaUserStartPage);
  }

  saveUserStartPage(userStartPage: string): void {
    localStorage.setItem(this.megaUserStartPage, userStartPage);
  }

  removeUserStartPage(): void {
    localStorage.removeItem(this.megaUserStartPage);
  }
}
