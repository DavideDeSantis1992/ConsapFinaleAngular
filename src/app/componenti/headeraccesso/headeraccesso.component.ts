import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-headeraccesso',
  templateUrl: './headeraccesso.component.html',
  styleUrls: ['./headeraccesso.component.css']
})
export class HeaderaccessoComponent implements OnInit {

  flagDropdown: boolean = false;

  isRotated: boolean = false;
  currentUser: string =  '' ; 
   url:string='';
  
  
  
  constructor(private auth : AuthService) {
  }
  ngOnInit(): void {
   const user = sessionStorage.getItem('userName');
   console.log('user: ', user);
   this.currentUser = user;
   

   if(user==='rossi'){
    this.url='https://www.lagazzettadelmezzogiorno.it/resizer/600/315/true/1544689307219.jpg--il_foggia_cerca_allenatore__delneri_e_out__ipotesi_delio_rossi.jpg?1544689307000';
   }else if(user==='micocci'){
    this.url='https://www.today.it/~media/horizontal-hi/11821207273640/avatar-la-leggenda-di-aang-3.jpg';
   }else if(user==='giusti'){
    this.url='https://t4.ftcdn.net/jpg/02/99/62/11/360_F_299621124_vutDKbNwRJG6poJRQQIMYfsc4tJCTO5E.jpg';
   }else if(user==='desantis'){
    this.url='https://upload.wikimedia.org/wikipedia/commons/9/98/Claudio_Lotito_datisenato.jpeg';
   }else if(user==='biagi'){  
    this.url='https://images.daznservices.com/di/library/DAZN_News/1e/4c/esultanza-kaka-mano-sul-cuore_1bm5wbi19l71n1ce6ppzodnf3w.png?t=-1542629153';
   }
  
}
  
   
  

  logout(){
    this.auth.removeAuthenticated();
  }
  @HostListener('keydown.Tab', ['$event'])
  handleTab(event: KeyboardEvent) {
    event.preventDefault();
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
