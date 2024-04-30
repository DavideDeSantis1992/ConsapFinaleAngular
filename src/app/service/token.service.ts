import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

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
