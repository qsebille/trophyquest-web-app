import {inject, Injectable} from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class Navigator {
  private readonly router: Router = inject(Router);

  goToHomePage(): void {
    this.router.navigate(['/']).then(() => console.info('Navigated to home page'));
  }

  goToErrorPage(): void {
    this.router.navigate(['/error']).then(() => console.info('Navigated to error page'));
  }

}
