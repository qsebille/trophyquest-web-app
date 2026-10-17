import {inject, Service} from '@angular/core';
import {Router} from "@angular/router";

@Service()
export class NavigatorService {
  private readonly router = inject(Router);

  goToHomePage(): void {
    this.router.navigate(['/']).then(() => console.info('Navigated to home page'));
  }

  goToErrorPage(): void {
    this.router.navigate(['/error']).then(() => console.info('Navigated to error page'));
  }

  goToGamePage(gameId: string): void {
    this.router.navigate(['/game', gameId]).then(() => console.info('Navigated to game page: ' + gameId));
  }
}
