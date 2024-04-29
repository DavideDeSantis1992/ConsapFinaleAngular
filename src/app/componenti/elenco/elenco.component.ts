import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-elenco',
  templateUrl: './elenco.component.html',
  styleUrls: ['./elenco.component.css'],
})
export class ElencoComponent implements OnInit {
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
  paginaSelezionata: string = '5/pagina';
  currentPage: any = 1; // fisso a 1
  pageSize: any = 5;
  pagineTotali: any = 0;
  zero: any = 0;
  ordinamentoNumeroTicket: string = 'desc';
  ordinamentoDataCreazione: string = 'desc';
  numeroCaso: number = 0;
  private urlMod = '';
  private urlX = `http://localhost:8080/richiesta/`;

  constructor(
    private richiestaService: RichiestaService,
    private http: HttpClient,
    private elRef: ElementRef
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

    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.log('ACCESS TOKEN NON TROVATO');
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

    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.log('ACCESS TOKEN NON TROVATO');
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
        .elencoAttributiOrdinati('numeroTicket', 'asc', this.pageSize)
        .subscribe((data) => {
          this.richieste = data.elenco.content;
          this.pagineTotali = data.elenco.totalPages;
        });
    } else {
      this.ordinamentoNumeroTicket = 'desc';
      this.numeroCaso = 2;
      this.currentPage = 1;
      this.richiestaService
        .elencoAttributiOrdinati('numeroTicket', 'desc', this.pageSize)
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
        .elencoAttributiOrdinati('dataCreazione', 'asc', this.pageSize)
        .subscribe((data) => {
          this.richieste = data.elenco.content;
          this.pagineTotali = data.elenco.totalPages;
        });
    } else {
      this.ordinamentoDataCreazione = 'desc';
      this.numeroCaso = 4;
      this.currentPage = 1;
      this.richiestaService
        .elencoAttributiOrdinati('dataCreazione', 'desc', this.pageSize)
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
    localStorage.setItem('idRichiesta', richiestaId.id);
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

    if (this.numeroCaso == 0) {
      this.getElenco();
    } else if (this.numeroCaso == 1) {
      this.ordinamentoNumeroTicket = 'asc';

      this.currentPage = 1;
      this.richiestaService
        .elencoAttributiOrdinati('numeroTicket', 'asc', this.pageSize)
        .subscribe((data) => {
          this.richieste = data.elenco.content;
          this.pagineTotali = data.elenco.totalPages;
        });
    } else if (this.numeroCaso == 2) {
      this.ordinamentoNumeroTicket = 'desc';
      this.currentPage = 1;
      this.richiestaService
        .elencoAttributiOrdinati('numeroTicket', 'desc', this.pageSize)
        .subscribe((data) => {
          this.richieste = data.elenco.content;
          this.pagineTotali = data.elenco.totalPages;
        });
    } else if (this.numeroCaso == 3) {
      this.ordinamentoNumeroTicket = 'asc';

      this.currentPage = 1;
      this.richiestaService
        .elencoAttributiOrdinati('dataCreazione', 'asc', this.pageSize)
        .subscribe((data) => {
          this.richieste = data.elenco.content;
          this.pagineTotali = data.elenco.totalPages;
        });
    } else if (this.numeroCaso == 4) {
      this.ordinamentoNumeroTicket = 'desc';
      this.currentPage = 1;
      this.richiestaService
        .elencoAttributiOrdinati('dataCreazione', 'desc', this.pageSize)
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


}
