import { Component, HostListener, OnInit } from '@angular/core';
import { RichiestaService } from '../../service/richiesta.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-ispeziona',
  templateUrl: './ispeziona.component.html',
  styleUrls: ['./ispeziona.component.css']
})
export class IspezionaComponent implements OnInit {
  @HostListener('keydown.Tab', ['$event'])
  handleTab(event: KeyboardEvent) {
    event.preventDefault();
  }

  idRichiesta: any;
  
  richiesta:any;
  richiestaShow:any;

  currentPage: any = 1;
  pageSize:any = 5;
  pagineTotali:any=0;

  constructor(private richiestaService: RichiestaService,private http: HttpClient) {}

  ngOnInit() {
    const id=localStorage.getItem('idRichiesta');
    this.idRichiesta=id;
    this.prendiRichiesta();
  }

  prendiRichiesta(){
    const idParsato = parseInt(this.idRichiesta);
    
    const dati = {
      "erroreDTO": null,
      "filtri": {
          "id": idParsato,
          "numeroTicket": null,
          "applicativoId": null,
          "oggetto": null,
          "statoRichiestaConsapId": null,
          "dataCreazione": null,
          "statoApprovazioneConsapId": null,
          "statoApprovazioneOsId": null,
          "statoRichiestaOsId": null,
          "dataStimaFinale": null,
          "importo": null,
          "commessaOsId": null
      },
      "elenco": null
  };
    this.richiestaService.idRichiesta(dati).subscribe((data) => {
    this.richiesta=data.elenco.content;
    const indice = 0;
    this.pagineTotali=data.elenco.totalPages;
    this.richiestaShow = data.elenco.content[indice];    
  }, (error) => {
    console.error(error);
  })
  }

  visualizzaRichiestaStorica(elementoStorico : any) {
    const indice = this.richiesta.indexOf(elementoStorico);
    this.richiestaShow = this.richiesta[indice];
  }

  prendiNumeroPaginaInput(){
      const numeroPaginaInput = (<HTMLInputElement>document.getElementById('numeroPaginaInput')).value;
      if(numeroPaginaInput<=this.pagineTotali){
      this.currentPage=numeroPaginaInput;
  
      this.numeroPaginataStorica(numeroPaginaInput).subscribe(data=>{
        this.richiesta=data.elenco.content;
        this.pagineTotali=data.elenco.totalPages;
      })
    } else {
      alert("Numero pagina non presente, pagine totali: "+this.pagineTotali);
    }
  }

  numeroPaginataStorica(paginaCorrente:any){
    
    const urlElenco = `http://localhost:8080/richiesta/storico/${paginaCorrente}-${this.pageSize}`;

    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.log("ACCESS TOKEN NON TROVATO");
      
    }

    const body = {
      "erroreDTO": null,
      "filtri": {
          "id": this.idRichiesta
          
      },
      "elenco": null
  };

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`);

    return this.http.post<any>(urlElenco, body, { headers });
  }

  paginaPrecedente() {
    if (this.currentPage > 1) {
      let currentPageCopy = this.currentPage;
      currentPageCopy--;
  
      this.numeroPaginataStorica(currentPageCopy).subscribe(data => {
        this.currentPage = currentPageCopy; 
        this.richiesta = data.elenco.content;
        this.pagineTotali = data.elenco.totalPages;
      });
    }
  }
  
  paginaSuccessiva() {
    if (this.currentPage < this.pagineTotali) {
      let currentPageCopy = this.currentPage;
      currentPageCopy++;
  
      this.numeroPaginataStorica(currentPageCopy).subscribe(data => {
        this.currentPage = currentPageCopy; 
        this.richiesta = data.elenco.content;
        this.pagineTotali = data.elenco.totalPages;
      });
    }
  }  
}
