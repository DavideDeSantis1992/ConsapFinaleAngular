import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { RichiestaService } from '../../service/richiesta.service';
import { TokenService } from '../../service/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  isButtonDisabled: boolean = true;
  showError: boolean = false;

  constructor(
    private router: Router,
    private richiestaService: RichiestaService,
    private authService: AuthService,
    private elRef: ElementRef,
    private token: TokenService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.route?.queryParams?.subscribe((params) => {
    //   this.username = params['username'] || '';
    //   this.password = params['password'] || '';
    // });
  }

  checkInputs(): void {
    this.isButtonDisabled = !(
      this.username.trim() !== '' && this.password.trim() !== ''
    );
  }

  login(username: string, password: string): void {
    const data = { username: this.username, password: this.password };

    this.richiestaService.loginRequest(data).subscribe(
      (response) => {
        if (response.status === 200) {
          console.log('Login effettuato');
          const token = response.headers.get('access_token');
          this.token.setToken(token);
          const encryptedToken = this.token.encryptToken(this.token.getToken());
          this.authService.setAuthenticated(encryptedToken);
          sessionStorage.setItem('userName', this.username);
          console.log('Utente attualmente connesso:', this.username);

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
