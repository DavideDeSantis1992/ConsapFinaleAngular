import { Injectable } from '@angular/core';
import { TokenService } from '../service/token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private token: TokenService, private router:Router) {}

  isAuthenticated(): boolean {
    if (typeof sessionStorage !== 'undefined') {
      const token = sessionStorage.getItem('encrypted_Token');
      if(token){
        return true;
      }
    }
    return false;
  }

  setAuthenticated(access_token: string): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('encrypted_Token', access_token);
    }
  }

  removeAuthenticated(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('secret_Key');
      sessionStorage.removeItem('encrypted_Token');
    }
  }
}
