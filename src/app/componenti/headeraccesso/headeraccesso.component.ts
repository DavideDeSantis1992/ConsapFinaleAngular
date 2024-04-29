import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-headeraccesso',
  templateUrl: './headeraccesso.component.html',
  styleUrls: ['./headeraccesso.component.css']
})
export class HeaderaccessoComponent {

  flagDropdown: boolean = false;

  isRotated: boolean = false;
  // gianni

  constructor(private auth : AuthService) {}
  logout(){
    // localStorage.removeItem('access_token');
    this.auth.removeAuthenticated();
  }

  


  apriChiudiDropdown() {
    console.log("apriChiudiDropdown");
    this.isRotated = !this.isRotated;
    // Gestione apertura e chiusura dropdown pagerChanger
    if (this.flagDropdown === false) {
      // Apri pagerChanger e porta la flag a true
      const dropdown = document.getElementById('pagerChanger');
      if (dropdown) {
        dropdown.classList.add('show');
        this.flagDropdown = true;
      }
    } else {
      // Chiudi pagerChanger e porta la flag a false
      const dropdown = document.getElementById('pagerChanger');
      if (dropdown) {
        dropdown.classList.remove('show');
        this.flagDropdown = false;
      }
    }
  }
}
