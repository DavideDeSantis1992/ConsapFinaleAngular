import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { RichiestaService } from '../../service/richiesta.service';
import {
  Applicativo,
  StatoApprovazioneConsap,
  StatoApprovazioneOs,
  StatoRichiestaConsap,
  StatoRichiestaOs,
  richiestaAttualeArr,
} from '../../service/richiesta';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Token } from '@angular/compiler';
import { TokenService } from '../../service/token.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-elenco',
  templateUrl: './elenco.component.html',
  styleUrls: ['./elenco.component.css'],
})
export class ElencoComponent implements OnInit {
  
  @ViewChild('content', { static: false }) content!: ElementRef;

  loading = true;
  showSpinner = true;
  richieste!: richiestaAttualeArr[];
  gianni: string = 'gianni';
  isDisabled: boolean = true;
  applicativo!: Applicativo[];
  statoRichiestaConsap!: StatoRichiestaConsap[];
  statoRichiestaOs!: StatoRichiestaOs[];
  statoApprovazioneConsap!: StatoApprovazioneConsap[];
  statoApprovazioneOs!: StatoApprovazioneOs[];
  flagDropdown: boolean = false;
  paginaSelezionata: string = '5';
  currentPage: any = 1; // fisso a 1
  pageSize: any = 5;
  pagineTotali: any = 0;
  zero: any = 0;
  ordinamentoNumeroTicket: string = 'desc';
  ordinamentoDataCreazione: string = 'desc';
  numeroCaso: number = 0;
  private urlMod = '';
  private urlX = `http://localhost:8080/richiesta/`;

  numeroTicketFiltro:any=null;
  oggettoFiltro:any=null;
  applicativoFiltro:any=null;
  statoRichiestaConsapFiltro:any=null;
  statoApprovazioneConsapFiltro:any=null;
  statoApprovazioneOsFiltro:any=null; 
  statoRichiestaOsFiltro:any=null;

  showGestioneArgomento:boolean=true;
  showGestioneIcona:boolean=true;

  // TODO: SISTEMARE TABULAZIONE, MOMENTANEAMENTE DISATTIVATA PER QUESTO COMPONENTE
  @HostListener('keydown.Tab', ['$event'])
  handleTab(event: KeyboardEvent) {
    event.preventDefault();
  }

  constructor(
    private richiestaService: RichiestaService,
    private http: HttpClient,
    private elRef: ElementRef,
    private token: TokenService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
      this.showSpinner = false;
      document.body.style.overflow = 'auto';
    }, 3000);

    this.getElenco();

    this.getApplicativo();
    this.getStatoRichiestaConsap();
    this.getStatoRichiestaOs();
    this.getStatoApprovazioneConsap();
    this.getStatoApprovazioneOs();
  }

  apriChiudiDropdown() {
    console.log('apriChiudiDropdown');

    if (this.flagDropdown === false) {
      const dropdown = document.getElementById('pagerChanger');
      if (dropdown) {
        dropdown.classList.add('show');
        this.flagDropdown = true;
      }
    } else {
      const dropdown = document.getElementById('pagerChanger');
      if (dropdown) {
        dropdown.classList.remove('show');
        this.flagDropdown = false;
      }
    }
  }

  apriChiudiDropdownSize() {
    console.log('apriChiudiDropdownSize');

    if (this.flagDropdown === false) {
      const dropdown = document.getElementById('pagerChangerSize');
      if (dropdown) {
        dropdown.classList.add('show');
        this.flagDropdown = true;
      }
    } else {
      const dropdown = document.getElementById('pagerChangerSize');
      if (dropdown) {
        dropdown.classList.remove('show');
        this.flagDropdown = false;
      }
    }
  }

  prendiValorePagina(event: MouseEvent) {
    const target = event.target as HTMLSpanElement;
    const valueText = target.textContent || '';
    const value = valueText.split('/')[0].trim();
    this.paginaSelezionata = valueText.trim();

    this.pageSize = value;
    this.currentPage = 1;

    this.paginata(value).subscribe((data) => {
      this.richieste = data.elenco.content;
      this.pagineTotali = data.elenco.totalPages;
    });
  }

  paginata(size: any): Observable<any> {
    const numeroTicket = (<HTMLInputElement>(
      document.getElementById('numeroTicketFiltro')
    )).value;
    const numeroTicketParsed =
      numeroTicket === '' ? null : parseInt(numeroTicket);

    const oggetto = (<HTMLInputElement>document.getElementById('oggettoFiltro'))
      .value;
    const oggettoParsed = oggetto === '' ? null : String(oggetto);

    const applicativo = (<HTMLSelectElement>(
      document.getElementById('applicativoFiltro')
    )).value;
    const applicativoParsed =
      applicativo === '' ? null : parseInt(applicativo) || null;

    const statoRichiestaConsap = (<HTMLSelectElement>(
      document.getElementById('statoRichiestaConsapFiltro')
    )).value;
    const statoRichiestaConsapParsed =
      statoRichiestaConsap === ''
        ? null
        : parseInt(statoRichiestaConsap) || null;

    const statoApprovazioneConsap = (<HTMLSelectElement>(
      document.getElementById('statoApprovazioneConsapFiltro')
    )).value;
    const statoApprovazioneConsapParsed =
      statoApprovazioneConsap === ''
        ? null
        : parseInt(statoApprovazioneConsap) || null;

    const statoApprovazioneOs = (<HTMLSelectElement>(
      document.getElementById('statoApprovazioneOsFiltro')
    )).value;
    const statoApprovazioneOsParsed =
      statoApprovazioneOs === '' ? null : parseInt(statoApprovazioneOs) || null;

    const statoRichiestaOs = (<HTMLSelectElement>(
      document.getElementById('statoRichiestaOsFiltro')
    )).value;
    const statoRichiestaOsParsed =
      statoRichiestaOs === '' ? null : parseInt(statoRichiestaOs) || null;

      this.numeroTicketFiltro=numeroTicketParsed,
      this.oggettoFiltro=oggettoParsed,
      this.applicativoFiltro=applicativoParsed,
      this.statoRichiestaConsapFiltro=statoRichiestaConsapParsed,
      this.statoApprovazioneConsapFiltro=statoApprovazioneConsapParsed,
      this.statoApprovazioneOsFiltro=statoApprovazioneOsParsed,
      this.statoRichiestaOsFiltro=statoRichiestaOsParsed

      let accessToken = '';
      if(typeof sessionStorage !== 'undefined'){
        const encToken = sessionStorage.getItem('encrypted_Token');
        accessToken = this.token.decryptToken(encToken);
        if(!accessToken){
          console.log("Token non trovato!!!")
        }
      }

    if (this.numeroCaso == 0) {
      this.urlMod =
        this.urlX +
        `${this.currentPage}-${size}?campo=dataCreazione&ordinamento=desc`;
      console.log('URL AGGIORNATO: ', this.urlMod);
    } else if (this.numeroCaso == 1) {
      this.urlMod =
        this.urlX +
        `${this.currentPage}-${size}?campo=numeroTicket&ordinamento=asc`;
      console.log('URL AGGIORNATO: ', this.urlMod);
    } else if (this.numeroCaso == 2) {
      this.urlMod =
        this.urlX +
        `${this.currentPage}-${size}?campo=numeroTicket&ordinamento=desc`;
      console.log('URL AGGIORNATO: ', this.urlMod);
    } else if (this.numeroCaso == 3) {
      this.urlMod =
        this.urlX +
        `${this.currentPage}-${size}?campo=dataCreazione&ordinamento=asc`;
      console.log('URL AGGIORNATO: ', this.urlMod);
    } else if (this.numeroCaso == 4) {
      this.urlMod =
        this.urlX +
        `${this.currentPage}-${size}?campo=dataCreazione&ordinamento=desc`;
      console.log('URL AGGIORNATO: ', this.urlMod);
    }

    const body = {
      erroreDTO: null,
      filtri: {
        id: null,
        numeroTicket: numeroTicketParsed,
        applicativo: { applicativoId: applicativoParsed },
        oggetto: oggettoParsed,
        statoRichiestaConsap: {
          statoRichiestaConsapId: statoRichiestaConsapParsed,
        },
        dataCreazione: null,
        statoApprovazioneConsap: {
          statoApprovazioneConsapId: statoApprovazioneConsapParsed,
        },
        statoApprovazioneOs: {
          statoApprovazioneOsId: statoApprovazioneOsParsed,
        },
        statoRichiestaOs: { statoRichiestaOsId: statoRichiestaOsParsed },
        dataStimaFinale: null,
        importo: null,
        commessaOsId: null,
      },
      elenco: null,
    };

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`);

    return this.http.post<any>(this.urlMod, body, { headers });
  }

  numeroPaginata(currentPage: any): Observable<any> {
    const numeroTicket = (<HTMLInputElement>(
      document.getElementById('numeroTicketFiltro')
    )).value;
    const numeroTicketParsed =
      numeroTicket === '' ? null : parseInt(numeroTicket);

    const oggetto = (<HTMLInputElement>document.getElementById('oggettoFiltro'))
      .value;
    const oggettoParsed = oggetto === '' ? null : String(oggetto);

    const applicativo = (<HTMLSelectElement>(
      document.getElementById('applicativoFiltro')
    )).value;
    const applicativoParsed =
      applicativo === '' ? null : parseInt(applicativo) || null;

    const statoRichiestaConsap = (<HTMLSelectElement>(
      document.getElementById('statoRichiestaConsapFiltro')
    )).value;
    const statoRichiestaConsapParsed =
      statoRichiestaConsap === ''
        ? null
        : parseInt(statoRichiestaConsap) || null;

    const statoApprovazioneConsap = (<HTMLSelectElement>(
      document.getElementById('statoApprovazioneConsapFiltro')
    )).value;
    const statoApprovazioneConsapParsed =
      statoApprovazioneConsap === ''
        ? null
        : parseInt(statoApprovazioneConsap) || null;

    const statoApprovazioneOs = (<HTMLSelectElement>(
      document.getElementById('statoApprovazioneOsFiltro')
    )).value;
    const statoApprovazioneOsParsed =
      statoApprovazioneOs === '' ? null : parseInt(statoApprovazioneOs) || null;

    const statoRichiestaOs = (<HTMLSelectElement>(
      document.getElementById('statoRichiestaOsFiltro')
    )).value;
    const statoRichiestaOsParsed =
      statoRichiestaOs === '' ? null : parseInt(statoRichiestaOs) || null;

      this.numeroTicketFiltro=numeroTicketParsed,
      this.oggettoFiltro=oggettoParsed,
      this.applicativoFiltro=applicativoParsed,
      this.statoRichiestaConsapFiltro=statoRichiestaConsapParsed,
      this.statoApprovazioneConsapFiltro=statoApprovazioneConsapParsed,
      this.statoApprovazioneOsFiltro=statoApprovazioneOsParsed,
      this.statoRichiestaOsFiltro=statoRichiestaOsParsed
      
    if (this.numeroCaso == 0) {
      this.urlMod =
        this.urlX +
        `${currentPage}-${this.pageSize}?campo=dataCreazione&ordinamento=desc`;
      console.log('URL AGGIORNATO: ', this.urlMod);
    } else if (this.numeroCaso == 1) {
      this.urlMod =
        this.urlX +
        `${currentPage}-${this.pageSize}?campo=numeroTicket&ordinamento=asc`;
      console.log('URL AGGIORNATO: ', this.urlMod);
    } else if (this.numeroCaso == 2) {
      this.urlMod =
        this.urlX +
        `${currentPage}-${this.pageSize}?campo=numeroTicket&ordinamento=desc`;
      console.log('URL AGGIORNATO: ', this.urlMod);
    } else if (this.numeroCaso == 3) {
      this.urlMod =
        this.urlX +
        `${currentPage}-${this.pageSize}?campo=dataCreazione&ordinamento=asc`;
      console.log('URL AGGIORNATO: ', this.urlMod);
    } else if (this.numeroCaso == 4) {
      this.urlMod =
        this.urlX +
        `${currentPage}-${this.pageSize}?campo=dataCreazione&ordinamento=desc`;
      console.log('URL AGGIORNATO: ', this.urlMod);
    }

    let accessToken = '';
    if(typeof sessionStorage !== 'undefined'){
      const encToken = sessionStorage.getItem('encrypted_Token');
      accessToken = this.token.decryptToken(encToken);
      if(!accessToken){
        console.log("ACCESS_TOKEN NON TROVATO")
      }
    }

    const body = {
      erroreDTO: null,
      filtri: {
        id: null,
        numeroTicket: numeroTicketParsed,
        applicativo: { applicativoId: applicativoParsed },
        oggetto: oggettoParsed,
        statoRichiestaConsap: {
          statoRichiestaConsapId: statoRichiestaConsapParsed,
        },
        dataCreazione: null,
        statoApprovazioneConsap: {
          statoApprovazioneConsapId: statoApprovazioneConsapParsed,
        },
        statoApprovazioneOs: {
          statoApprovazioneOsId: statoApprovazioneOsParsed,
        },
        statoRichiestaOs: { statoRichiestaOsId: statoRichiestaOsParsed },
        dataStimaFinale: null,
        importo: null,
        commessaOsId: null,
      },
      elenco: null,
    };

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`);

    return this.http.post<any>(this.urlMod, body, { headers });
  }
  getElenco() {
    this.richiestaService
      .elencoPaginatoPost('dataCreazione', 'desc')
      .subscribe((data) => {
        this.richieste = data.elenco.content;
        this.pagineTotali = data.elenco.totalPages;
      });
  }

  //ordinamento elenco per numeroTicket alternato crescente o decrescente

  getElencoNumeroTicket() {
    if (this.ordinamentoNumeroTicket === 'desc') {
      this.ordinamentoNumeroTicket = 'asc';
      this.numeroCaso = 1;
      this.currentPage = 1;
      this.richiestaService
        .elencoAttributiOrdinati('numeroTicket', 'asc', this.pageSize,this.numeroTicketFiltro,this.oggettoFiltro,this.applicativoFiltro,this.statoRichiestaConsapFiltro,this.statoApprovazioneConsapFiltro,this.statoApprovazioneOsFiltro,this.statoRichiestaOsFiltro)
        .subscribe((data) => {
          this.richieste = data.elenco.content;
          this.pagineTotali = data.elenco.totalPages;
        });
    } else {
      this.ordinamentoNumeroTicket = 'desc';
      this.numeroCaso = 2;
      this.currentPage = 1;
      this.richiestaService
        .elencoAttributiOrdinati('numeroTicket', 'desc', this.pageSize,this.numeroTicketFiltro,this.oggettoFiltro,this.applicativoFiltro,this.statoRichiestaConsapFiltro,this.statoApprovazioneConsapFiltro,this.statoApprovazioneOsFiltro,this.statoRichiestaOsFiltro)
        .subscribe((data) => {
          this.richieste = data.elenco.content;
          this.pagineTotali = data.elenco.totalPages;
        });
    }
  }

  // ordinamento elenco per data creazione alternato crescente o decrescente

  getElencoDataCreazione() {
    if (this.ordinamentoDataCreazione === 'desc') {
      this.ordinamentoDataCreazione = 'asc';
      this.numeroCaso = 3;
      this.currentPage = 1;
      this.richiestaService
        .elencoAttributiOrdinati('dataCreazione', 'asc', this.pageSize,this.numeroTicketFiltro,this.oggettoFiltro,this.applicativoFiltro,this.statoRichiestaConsapFiltro,this.statoApprovazioneConsapFiltro,this.statoApprovazioneOsFiltro,this.statoRichiestaOsFiltro)
        .subscribe((data) => {
          this.richieste = data.elenco.content;
          this.pagineTotali = data.elenco.totalPages;
        });
    } else {
      this.ordinamentoDataCreazione = 'desc';
      this.numeroCaso = 4;
      this.currentPage = 1;
      this.richiestaService
        .elencoAttributiOrdinati('dataCreazione', 'desc', this.pageSize,this.numeroTicketFiltro,this.oggettoFiltro,this.applicativoFiltro,this.statoRichiestaConsapFiltro,this.statoApprovazioneConsapFiltro,this.statoApprovazioneOsFiltro,this.statoRichiestaOsFiltro)
        .subscribe((data) => {
          this.richieste = data.elenco.content;
          this.pagineTotali = data.elenco.totalPages;
        });
    }
  }

  // Metodo per aprire il modal
  openModal() {
    const modal = document.getElementById('modalright');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  // Metodo per chiudere il modal
  closeModal() {
    const modal = document.getElementById('modalright');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  prendiId(richiestaId: any) {
      if(typeof localStorage !== 'undefined'){
        localStorage.setItem('idRichiesta', richiestaId.id);
      }
  }

  getApplicativo() {
    this.richiestaService.applicativoPost().subscribe((data) => {
      this.applicativo = data.elenco;
    });
  }

  getStatoRichiestaConsap() {
    this.richiestaService.statoRichiestaConsapPost().subscribe((data) => {
      this.statoRichiestaConsap = data.elenco;
    });
  }

  getStatoRichiestaOs() {
    this.richiestaService.statoRichiestaOsPost().subscribe((data) => {
      this.statoRichiestaOs = data.elenco;
    });
  }

  getStatoApprovazioneConsap() {
    this.richiestaService.statoApprovazioneConsapPost().subscribe((data) => {
      this.statoApprovazioneConsap = data.elenco;
    });
  }

  getStatoApprovazioneOs() {
    this.richiestaService.statoApprovazioneOsPost().subscribe((data) => {
      this.statoApprovazioneOs = data.elenco;
    });
  }

  applicaFiltri() {
    const numeroTicket = (<HTMLInputElement>(
      document.getElementById('numeroTicketFiltro')
    )).value;
    const numeroTicketParsed =
      numeroTicket === '' ? null : parseInt(numeroTicket);

    const oggetto = (<HTMLInputElement>document.getElementById('oggettoFiltro'))
      .value;
    const oggettoParsed = oggetto === '' ? null : String(oggetto);

    const applicativo = (<HTMLSelectElement>(
      document.getElementById('applicativoFiltro')
    )).value;
    const applicativoParsed =
      applicativo === '' ? null : parseInt(applicativo) || null;

    const statoRichiestaConsap = (<HTMLSelectElement>(
      document.getElementById('statoRichiestaConsapFiltro')
    )).value;
    const statoRichiestaConsapParsed =
      statoRichiestaConsap === ''
        ? null
        : parseInt(statoRichiestaConsap) || null;

    const statoApprovazioneConsap = (<HTMLSelectElement>(
      document.getElementById('statoApprovazioneConsapFiltro')
    )).value;
    const statoApprovazioneConsapParsed =
      statoApprovazioneConsap === ''
        ? null
        : parseInt(statoApprovazioneConsap) || null;

    const statoApprovazioneOs = (<HTMLSelectElement>(
      document.getElementById('statoApprovazioneOsFiltro')
    )).value;
    const statoApprovazioneOsParsed =
      statoApprovazioneOs === '' ? null : parseInt(statoApprovazioneOs) || null;

    const statoRichiestaOs = (<HTMLSelectElement>(
      document.getElementById('statoRichiestaOsFiltro')
    )).value;
    const statoRichiestaOsParsed =
      statoRichiestaOs === '' ? null : parseInt(statoRichiestaOs) || null;

      this.numeroTicketFiltro=numeroTicketParsed,
      this.oggettoFiltro=oggettoParsed,
      this.applicativoFiltro=applicativoParsed,
      this.statoRichiestaConsapFiltro=statoRichiestaConsapParsed,
      this.statoApprovazioneConsapFiltro=statoApprovazioneConsapParsed,
      this.statoApprovazioneOsFiltro=statoApprovazioneOsParsed,
      this.statoRichiestaOsFiltro=statoRichiestaOsParsed


    const dati = {
      erroreDTO: null,
      filtri: {
        id: null,
        numeroTicket: numeroTicketParsed,
        applicativo: { applicativoId: applicativoParsed },
        oggetto: oggettoParsed,
        statoRichiestaConsap: {
          statoRichiestaConsapId: statoRichiestaConsapParsed,
        },
        dataCreazione: null,
        statoApprovazioneConsap: {
          statoApprovazioneConsapId: statoApprovazioneConsapParsed,
        },
        statoApprovazioneOs: {
          statoApprovazioneOsId: statoApprovazioneOsParsed,
        },
        statoRichiestaOs: { statoRichiestaOsId: statoRichiestaOsParsed },
        dataStimaFinale: null,
        importo: null,
        commessaOsId: null,
      },
      elenco: null,
    };
    this.currentPage = 1;

    if (this.numeroCaso == 0) {
      this.urlMod =
        this.urlX +
        `${this.currentPage}-${this.pageSize}?campo=dataCreazione&ordinamento=desc`;
    } else if (this.numeroCaso == 1) {
      this.urlMod =
        this.urlX +
        `${this.currentPage}-${this.pageSize}?campo=numeroTicket&ordinamento=asc`;
    } else if (this.numeroCaso == 2) {
      this.urlMod =
        this.urlX +
        `${this.currentPage}-${this.pageSize}?campo=numeroTicket&ordinamento=desc`;
    } else if (this.numeroCaso == 3) {
      this.urlMod =
        this.urlX +
        `${this.currentPage}-${this.pageSize}?campo=dataCreazione&ordinamento=asc`;
    } else if (this.numeroCaso == 4) {
      this.urlMod =
        this.urlX +
        `${this.currentPage}-${this.pageSize}?campo=dataCreazione&ordinamento=desc`;
    }

    this.richiestaService.elencoFiltratoPost(dati, this.urlMod).subscribe(
      (data) => {
        this.richieste = data.elenco.content;
        this.pagineTotali = data.elenco.totalPages;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  resetFiltri() {
    // Ripristina i valori originali dei campi
    const numeroTicketInput = <HTMLInputElement>(
      document.getElementById('numeroTicketFiltro')
    );
    numeroTicketInput.value = '';

    const oggettoInput = <HTMLInputElement>(
      document.getElementById('oggettoFiltro')
    );
    oggettoInput.value = '';

    const applicativoSelect = <HTMLSelectElement>(
      document.getElementById('applicativoFiltro')
    );
    applicativoSelect.value = 'null';

    const statoRichiestaConsapSelect = <HTMLSelectElement>(
      document.getElementById('statoRichiestaConsapFiltro')
    );
    statoRichiestaConsapSelect.value = 'null';

    const statoRichiestaOsSelect = <HTMLSelectElement>(
      document.getElementById('statoRichiestaOsFiltro')
    );
    statoRichiestaOsSelect.value = 'null';

    const statoApprovazioneConsapSelect = <HTMLSelectElement>(
      document.getElementById('statoApprovazioneConsapFiltro')
    );
    statoApprovazioneConsapSelect.value = 'null';

    const statoApprovazioneOsSelect = <HTMLSelectElement>(
      document.getElementById('statoApprovazioneOsFiltro')
    );
    statoApprovazioneOsSelect.value = 'null';

    this.numeroTicketFiltro=null,
      this.oggettoFiltro=null,
      this.applicativoFiltro=null,
      this.statoRichiestaConsapFiltro=null,
      this.statoApprovazioneConsapFiltro=null,
      this.statoApprovazioneOsFiltro=null,
      this.statoRichiestaOsFiltro=null

    if (this.numeroCaso == 0) {
      this.getElenco();
    } else if (this.numeroCaso == 1) {
      this.ordinamentoNumeroTicket = 'asc';

      this.currentPage = 1;
      this.richiestaService
        .elencoAttributiOrdinati('numeroTicket', 'asc', this.pageSize,this.numeroTicketFiltro,this.oggettoFiltro,this.applicativoFiltro,this.statoRichiestaConsapFiltro,this.statoApprovazioneConsapFiltro,this.statoApprovazioneOsFiltro,this.statoRichiestaOsFiltro)
        .subscribe((data) => {
          this.richieste = data.elenco.content;
          this.pagineTotali = data.elenco.totalPages;
        });
    } else if (this.numeroCaso == 2) {
      this.ordinamentoNumeroTicket = 'desc';
      this.currentPage = 1;
      this.richiestaService
        .elencoAttributiOrdinati('numeroTicket', 'desc', this.pageSize,this.numeroTicketFiltro,this.oggettoFiltro,this.applicativoFiltro,this.statoRichiestaConsapFiltro,this.statoApprovazioneConsapFiltro,this.statoApprovazioneOsFiltro,this.statoRichiestaOsFiltro)
        .subscribe((data) => {
          this.richieste = data.elenco.content;
          this.pagineTotali = data.elenco.totalPages;
        });
    } else if (this.numeroCaso == 3) {
      this.ordinamentoNumeroTicket = 'asc';

      this.currentPage = 1;
      this.richiestaService
        .elencoAttributiOrdinati('dataCreazione', 'asc', this.pageSize,this.numeroTicketFiltro,this.oggettoFiltro,this.applicativoFiltro,this.statoRichiestaConsapFiltro,this.statoApprovazioneConsapFiltro,this.statoApprovazioneOsFiltro,this.statoRichiestaOsFiltro)
        .subscribe((data) => {
          this.richieste = data.elenco.content;
          this.pagineTotali = data.elenco.totalPages;
        });
    } else if (this.numeroCaso == 4) {
      this.ordinamentoNumeroTicket = 'desc';
      this.currentPage = 1;
      this.richiestaService
        .elencoAttributiOrdinati('dataCreazione', 'desc', this.pageSize,this.numeroTicketFiltro,this.oggettoFiltro,this.applicativoFiltro,this.statoRichiestaConsapFiltro,this.statoApprovazioneConsapFiltro,this.statoApprovazioneOsFiltro,this.statoRichiestaOsFiltro)
        .subscribe((data) => {
          this.richieste = data.elenco.content;
          this.pagineTotali = data.elenco.totalPages;
        });
    }
  }

  prendiNumeroPagina(event: MouseEvent) {
    const target = event.target as HTMLSpanElement;
    const valueText = target.textContent || '';
    const currentPageSelezionato = valueText.split('/')[0].trim();

    this.currentPage = currentPageSelezionato;
    this.numeroPaginata(currentPageSelezionato).subscribe((data) => {
      this.richieste = data.elenco.content;
      this.pagineTotali = data.elenco.totalPages;
    });
  }

  prendiNumeroPaginaInput() {
    // devo prendere il valore del campo con id "numeroPaginaInput"
    const numeroPaginaInput = (<HTMLInputElement>(
      document.getElementById('numeroPaginaInput')
    )).value;

    if (
      numeroPaginaInput <= this.pagineTotali &&
      numeroPaginaInput > this.zero
    ) {
      this.currentPage = numeroPaginaInput;

      this.numeroPaginata(numeroPaginaInput).subscribe((data) => {
        this.richieste = data.elenco.content;
        this.pagineTotali = data.elenco.totalPages;
      });
    } else {
      alert('Numero pagina non presente, pagine da 1 a ' + this.pagineTotali);
    }
  }

  paginaPrecedente() {
    if (this.currentPage > 1) {
      let currentPageCopy = this.currentPage; // Salviamo il valore corrente di currentPage in una variabile locale
      currentPageCopy--; // Decrementiamo il valore per la pagina precedente

      this.numeroPaginata(currentPageCopy).subscribe((data) => {
        this.currentPage = currentPageCopy; // Aggiorniamo this.currentPage con il valore corretto
        this.richieste = data.elenco.content;
        this.pagineTotali = data.elenco.totalPages;
      });
    }
  }

  paginaSuccessiva() {
    if (this.currentPage < this.pagineTotali) {
      let currentPageCopy = this.currentPage; // Salviamo il valore corrente di currentPage in una variabile locale
      currentPageCopy++; // Incrementiamo il valore per la pagina successiva

      this.numeroPaginata(currentPageCopy).subscribe((data) => {
        this.currentPage = currentPageCopy; // Aggiorniamo this.currentPage con il valore corretto
        this.richieste = data.elenco.content;
        this.pagineTotali = data.elenco.totalPages;
      });
    }
  }

//   generaPdf(): void {
//     // Seleziona solo il contenuto con l'ID 'elencoDaStampare'
//     const contentToPrint = document.getElementById('elencoDaStampare');

//     // Verifica se il contenuto da stampare è stato trovato e se contiene un contenuto valido
//     if (contentToPrint && contentToPrint.innerHTML.trim().length > 0) {
//         // Calcola le dimensioni del documento basate sulla finestra del browser
//         const docWidth = window.innerHeight; // Usa l'altezza del browser come larghezza del documento PDF
//         const docHeight = window.innerWidth; // Usa la larghezza del browser come altezza del documento PDF

//         // Crea un'istanza di jsPDF con il formato orizzontale del documento
//         const doc = new jsPDF({
//             orientation: 'landscape', // Imposta l'orientamento orizzontale
//             unit: 'px', // Imposta l'unità di misura su pixel
//             format: [docWidth, docHeight] // Imposta le dimensioni del documento
//         });

//         // Converte il contenuto selezionato in PDF
//         doc.html(contentToPrint, {
//             callback: function (pdf) {
//                 // Salva il PDF
//                 pdf.save("documento.pdf"); // Salva il PDF con un nome specifico
//             }
//         });
//     } else {
//         console.error('Il contenuto da stampare non è stato trovato o è vuoto.');
//     }
// }

generaPDF(){
  // this.showGestioneArgomento = false;
  // this.showGestioneIcona=false
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const content = this.content.nativeElement;

  // Seleziona la colonna "Gestione Richiesta" e rimuovila sia dall'intestazione che dai dati

  html2canvas(content, { scale: 2 })
    .then(canvas => {
      const imageData = canvas.toDataURL('image/png');
      const imgWidth = 300;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Aggiungi il resto del contenuto sotto l'intestazione
      pdf.addImage(imageData, 'PNG', 0, 20, imgWidth, imgHeight);

      pdf.save('test.pdf');

      
    });
    

    

}

}

