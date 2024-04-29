import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: string | null = null;
  private secretKey : string;
  private tokenExpirationTimer : any;

  constructor(private router:Router) { 
    if (typeof sessionStorage !== 'undefined') {
      const storedSecretKey = sessionStorage.getItem('secret_Key');
      if (storedSecretKey) {
        this.secretKey = storedSecretKey;
      } else {
        this.secretKey = this.generateSecretKey(32);
        sessionStorage.setItem('secret_Key', this.secretKey);
      }
    }
  }

  startTokenExpirationTimer(): void {
    this.stopTokenExpirationTimer();
    const tokenRemovalTimeout = 30 * 1000;

    const alertTimeout = 10 * 1000;

    setTimeout(() => {
      alert(
        'Il token sta per scadere fra 30 secondi. Verrai re-indirizzato alla home'
      );
    }, alertTimeout);

    this.tokenExpirationTimer = setTimeout(() => {
      if(typeof sessionStorage !== 'undefined'){
        const tkn = sessionStorage.getItem('encrypted_Token');
        console.log('tkn',tkn)
        if(tkn){
          sessionStorage.removeItem('secret_Key');
          sessionStorage.removeItem('encrypted_Token');
          this.router.navigate(['/login']);
        }
      }
    }, tokenRemovalTimeout);
  }


  stopTokenExpirationTimer(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }



  private generateSecretKey(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  encryptToken(token: string): string {
    sessionStorage.setItem('secret_Key', this.secretKey);
    const encryptedToken = CryptoJS.AES.encrypt(
      token,
      this.secretKey
    ).toString();
    return encryptedToken;
  }

  decryptToken(encryptedToken: string): string {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, this.secretKey);
    const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedToken;
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
  }
}
