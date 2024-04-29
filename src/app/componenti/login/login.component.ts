import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { RichiestaService } from '../../service/richiesta.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  isButtonDisabled: boolean = true;
  showError: boolean = false;

  constructor(
    private router: Router,
    private richiestaService: RichiestaService,
    private authService: AuthService,
    private elRef: ElementRef
  ) {}

  checkInputs(): void {
    this.isButtonDisabled = !(
      this.username.trim() !== '' && this.password.trim() !== ''
    );
  }

  login(username: string, password: string): void {
    const data = { username: this.username, password: this.password };

    this.richiestaService.loginPost(data).subscribe(
      (response) => {
        console.log('Login effettuato');
        const accessToken = response.headers.get('access_token');
        if (accessToken) {
          this.authService.setAuthenticated(accessToken); // Imposta l'access token come autenticato
          this.router.navigate(['/homeaccesso']);
        } else {
          console.error(
            'Login fallito: access_token non trovato negli headers'
          );
          this.showError = true;
        }
      },
      (error) => {
        console.error('Login fallito:', error);
        this.showError = true;
      }
    );
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      const inputs = this.elRef.nativeElement.querySelectorAll('input');
      const lastInput = inputs[inputs.length - 1];
      if (document.activeElement === lastInput) {
        event.preventDefault();
        const firstInput = inputs[0];
        if (firstInput) {
          firstInput.focus();
        }
      }
    }
  }
}
