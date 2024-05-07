import { Component, ElementRef } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RichiestaService } from '../../service/richiesta.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrl: './registrazione.component.css',
})
export class RegistrazioneComponent {
  userForm: FormGroup;
  isFormSubmitted: boolean = false;
  showPassword: boolean = false;
  showPasswordRipetuta: boolean = false;
  showDropdown: boolean = false;

  constructor(
    private elRef: ElementRef,
    private richiestaService: RichiestaService,
    private router: Router
  ) {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(16),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.pattern(/^(?=.*[A-Z])/), // Almeno una lettera maiuscola
        Validators.pattern(/^(?=.*\d)/), // Almeno un numero
        Validators.pattern(/^(?=.*[!@#$%^&*])/), // Almeno un carattere speciale
      ]),
      confermaPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.pattern(/^(?=.*[A-Z])/), // Almeno una lettera maiuscola
        Validators.pattern(/^(?=.*\d)/), // Almeno un numero
        Validators.pattern(/^(?=.*[!@#$%^&*])/), // Almeno un carattere speciale,
        this.passwordMatchValidator.bind(this),
      ]),
      ruolo: new FormControl('', [Validators.required]),
    });
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = this.userForm?.get('password')?.value;
    const confirmPassword = control.value;
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  togglePasswordVisibilityRipetuta() {
    this.showPasswordRipetuta = !this.showPasswordRipetuta;
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

  onSubmit() {
    const data = {
      id: null,
      email: this.userForm?.get('email')?.value,
      username: this.userForm?.get('username')?.value,
      password: this.userForm?.get('password')?.value,
      confermaPassword: this.userForm?.get('confermaPassword')?.value,
      ruolo: this.userForm?.get('ruolo').value,
    };

    const filtro = {
      erroreDTO: null,
      filtri: null,
      elenco: [
        {
          id: null,
          email: this.userForm?.get('email')?.value,
          username: this.userForm?.get('username')?.value,
          password: this.userForm?.get('password')?.value,
          controlloPassword: this.userForm?.get('confermaPassword')?.value,
          ruolo: this.userForm?.get('ruolo').value,
        }
      ]
  }

    
    this.richiestaService.registrazineRequest(filtro).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status === 201) {
          this.router.navigate(['/login'],
          // { queryParams: { username: this.userForm?.get('username')?.value, password: this.userForm?.get('password')?.value } }
        );
        }
      },
      (error: any) => {
        console.error('Errore nella chiamata POST:', error);
      }
    );
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }
}
