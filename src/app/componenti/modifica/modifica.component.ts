import { Component, ElementRef, OnInit } from '@angular/core';
import { RichiestaService } from '../../service/richiesta.service';
import {
  CommessaOs,
  StatoApprovazioneConsap,
  StatoApprovazioneOs,
  StatoRichiestaConsap,
  StatoRichiestaOs,
} from '../../service/richiesta';

@Component({
  selector: 'app-modifica',
  templateUrl: './modifica.component.html',
  styleUrl: './modifica.component.css',
})
export class ModificaComponent implements OnInit {
  idRichiesta: any;
  richiesta: any;
  statoRichiestaConsap!: StatoRichiestaConsap[];
  idEreditatoStatoRichiestaConsap!: any;
  condizioneVisibleNullStatoRichiestaConsap: boolean = true;
  statoRichiestaOs!: StatoRichiestaOs[];
  idEreditatoStatoRichiestaOs!: any;
  condizioneVisibleNullStatoRichiestaOs: boolean = true;
  statoApprovazioneConsap!: StatoApprovazioneConsap[];
  idEreditatoStatoApprovazioneConsapBox!: any;
  condizioneVisibleNullStatoApprovazioneConsap: boolean = true;
  statoApprovazioneOs!: StatoApprovazioneOs[];
  idEreditatoStatoApprovazioneOsBox!: any;
  condizioneVisibleNullStatoApprovazioneOs: boolean = true;
  commessaOs!: CommessaOs[];

  dataCreazione: string = '';

  constructor(private richiestaService: RichiestaService, private elRef:ElementRef) {}



  ngOnInit(): void {
    const id = localStorage.getItem('idRichiesta');
    this.idRichiesta = id;
    this.prendiRichiestaConCombo();
    this.aggiornaDataCreazione();
  }

  aggiornaDataCreazione(): void {
    const dataCreazioneElement = document.getElementById(
      'dataCreazione'
    ) as HTMLInputElement;
    this.dataCreazione = dataCreazioneElement.value;
  }

  prendiRichiestaConCombo() {
    const idParsato = parseInt(this.idRichiesta);

    const dati = {
      erroreDTO: null,
      filtri: {
        id: idParsato,
      },
      elenco: null,
    };

    this.richiestaService.idRichiestaModifica(dati).subscribe((data) => {
      this.richiesta = data.elenco.content[0];
      
      this.dataCreazione = this.richiesta.dataCreazione;
      
      ///////////////////////////////////////////////////////////////////////////////////////////////

      this.richiestaService.statoRichiestaConsapPost().subscribe((data) => {
        if (this.richiesta.statoRichiestaConsap == null) {
          this.idEreditatoStatoRichiestaConsap = null;
        } else {
          this.idEreditatoStatoRichiestaConsap =
            this.richiesta.statoRichiestaConsap.statoRichiestaConsapId;
        }
        this.statoRichiestaConsap = data.elenco;
        const ultimo = this.statoRichiestaConsap.length;
        const penultimo = this.statoRichiestaConsap.length - 1;

        if (this.idEreditatoStatoRichiestaConsap == null) {
          this.statoRichiestaConsap.forEach((elemento, indice) => {
            this.statoRichiestaConsap[indice].abilitato = indice === 0;
          });
        } else {
          this.condizioneVisibleNullStatoRichiestaConsap = false;
          if (this.idEreditatoStatoRichiestaConsap <= penultimo) {
            this.statoRichiestaConsap.forEach((elemento, indice) => {
              this.statoRichiestaConsap[indice].abilitato =
                indice === this.idEreditatoStatoRichiestaConsap - 1 ||
                indice === this.idEreditatoStatoRichiestaConsap;
            });
          }
          if (this.idEreditatoStatoRichiestaConsap == ultimo) {
            this.statoRichiestaConsap.forEach((elemento, indice) => {
              this.statoRichiestaConsap[indice].abilitato =
                indice === this.idEreditatoStatoRichiestaConsap - 1;
            });
          }
        }
      });

      ///////////////////////////////////////////////////////////////////////////////////////////////

      this.richiestaService.statoRichiestaOsPost().subscribe((data) => {
        this.statoRichiestaOs = data.elenco;
        const ultimo = this.statoRichiestaOs.length;
        const penultimo = ultimo - 1;

        if (this.richiesta.statoRichiestaOs == null) {
          this.idEreditatoStatoRichiestaOs = null;
        } else {
          this.idEreditatoStatoRichiestaOs =
            this.richiesta.statoRichiestaOs.statoRichiestaOsId;
        }

        if (this.idEreditatoStatoRichiestaOs == null) {
          this.statoRichiestaOs.forEach((elemento, indice) => {
            this.statoRichiestaOs[indice].abilitato = indice === 0;
          });
        } else {
          this.condizioneVisibleNullStatoRichiestaOs = false;
          if (this.idEreditatoStatoRichiestaOs <= penultimo) {
            this.statoRichiestaOs.forEach((elemento, indice) => {
              this.statoRichiestaOs[indice].abilitato =
                indice === this.idEreditatoStatoRichiestaOs - 1 ||
                indice === this.idEreditatoStatoRichiestaOs;
            });
          }
          if (this.idEreditatoStatoRichiestaOs == ultimo) {
            this.statoRichiestaOs.forEach((elemento, indice) => {
              this.statoRichiestaOs[indice].abilitato = indice === penultimo;
            });
          }
        }
      });

      ///////////////////////////////////////////////////////////////////////////////////////////////

      this.richiestaService.statoApprovazioneConsapPost().subscribe((data) => {
        this.statoApprovazioneConsap = data.elenco;
        const ultimo = this.statoApprovazioneConsap.length;
        const penultimo = ultimo - 1;

        if (this.richiesta.statoApprovazioneConsap == null) {
          this.idEreditatoStatoApprovazioneConsapBox = null;
        } else {
          this.idEreditatoStatoApprovazioneConsapBox =
            this.richiesta.statoApprovazioneConsap.statoApprovazioneConsapId;
        }

        if (this.idEreditatoStatoApprovazioneConsapBox == null) {
          this.statoApprovazioneConsap.forEach((elemento, indice) => {
            this.statoApprovazioneConsap[indice].abilitato = indice === 0;
          });
        } else {
          this.condizioneVisibleNullStatoApprovazioneConsap = false;
          if (this.idEreditatoStatoApprovazioneConsapBox <= penultimo) {
            this.statoApprovazioneConsap.forEach((elemento, indice) => {
              this.statoApprovazioneConsap[indice].abilitato =
                indice === this.idEreditatoStatoApprovazioneConsapBox - 1 ||
                indice === this.idEreditatoStatoApprovazioneConsapBox;
            });
          }
          if (this.idEreditatoStatoApprovazioneConsapBox == ultimo) {
            this.statoApprovazioneConsap.forEach((elemento, indice) => {
              this.statoApprovazioneConsap[indice].abilitato =
                indice === penultimo;
            });
          }
        }
      });

      //////////////////////////////////////////////////////////////////////////////////////////////

      this.richiestaService.statoApprovazioneOsPost().subscribe((data) => {
        this.statoApprovazioneOs = data.elenco;
        const ultimo = this.statoApprovazioneOs.length;
        const penultimo = ultimo - 1;

        if (this.richiesta.statoApprovazioneOs == null) {
          this.idEreditatoStatoApprovazioneOsBox = null;
        } else {
          this.idEreditatoStatoApprovazioneOsBox =
            this.richiesta.statoApprovazioneOs.statoApprovazioneOsId;
        }

        if (this.idEreditatoStatoApprovazioneOsBox == null) {
          this.statoApprovazioneOs.forEach((elemento, indice) => {
            this.statoApprovazioneOs[indice].abilitato = indice === 0;
          });
        } else {
          this.condizioneVisibleNullStatoApprovazioneOs = false;
          if (this.idEreditatoStatoApprovazioneOsBox <= penultimo) {
            this.statoApprovazioneOs.forEach((elemento, indice) => {
              this.statoApprovazioneOs[indice].abilitato =
                indice === this.idEreditatoStatoApprovazioneOsBox - 1 ||
                indice === this.idEreditatoStatoApprovazioneOsBox;
            });
          }
          if (this.idEreditatoStatoApprovazioneOsBox == ultimo) {
            this.statoApprovazioneOs.forEach((elemento, indice) => {
              this.statoApprovazioneOs[indice].abilitato = indice === penultimo;
            });
          }
        }
      });

      /////////////////////////////////////////////////////////////////////////////////////////

      this.richiestaService.commessaOsPost().subscribe((data) => {
        this.commessaOs = data.elenco;
        
      });
    });
  }

  editRichiesta() {
    const numeroTicket = (<HTMLInputElement>(
      document.getElementById('numeroTicket')
    )).value;
    const numeroTicketParsed = parseInt(numeroTicket);

    const oggetto = (<HTMLInputElement>document.getElementById('oggetto'))
      .value;
    const oggettoParsed: string = String(oggetto);

    const applicativoInput = document.getElementById(
      'applicativo'
    ) as HTMLInputElement;
    const applicativoIdString = applicativoInput.getAttribute('applicativoId');
    const applicativoId = applicativoIdString
      ? parseInt(applicativoIdString)
      : null;

    const dataCreazione = (<HTMLInputElement>(
      document.getElementById('dataCreazione')
    )).value;
    const dataCreazioneParsed: string = String(dataCreazione);

    const statoRichiestaConsap = (<HTMLSelectElement>(
      document.getElementById('statoRichiestaConsap')
    )).value;
    const statoRichiestaConsapParsed =
      statoRichiestaConsap === '' ? null : parseInt(statoRichiestaConsap);

    const importo = (<HTMLInputElement>document.getElementById('importo'))
      .value;
    const importoParsed = importo === '' ? null : importo;

    const statoApprovazioneConsap = (<HTMLSelectElement>(
      document.getElementById('statoApprovazioneConsap')
    )).value;

    const statoApprovazioneConsapParsed =
      statoApprovazioneConsap === '' ? null : parseInt(statoApprovazioneConsap);

    const statoApprovazioneOs = (<HTMLSelectElement>(
      document.getElementById('statoApprovazioneOs')
    )).value;
    const statoApprovazioneOsParsed =
      statoApprovazioneOs === '' ? null : parseInt(statoApprovazioneOs);

    const statoRichiestaOs = (<HTMLSelectElement>(
      document.getElementById('statoRichiestaOs')
    )).value;
    const statoRichiestaOsParsed =
      statoRichiestaOs === '' ? null : parseInt(statoRichiestaOs);

    const dataStimaFinale = (<HTMLInputElement>(
      document.getElementById('dataStimaFinale')
    )).value;

    const dataStimaFinaleParsed =
      dataStimaFinale === '' ? null : String(dataStimaFinale);

    const commessaOs = (<HTMLSelectElement>(
      document.getElementById('commessaOs')
    )).value;
    const commessaOsParsed = commessaOs === '' ? null : parseInt(commessaOs);

    const dati = {
      erroreDTO: null,
      filtri: { id: this.idRichiesta },
      elenco: [
        {
          id: null,
          numeroTicket: numeroTicketParsed,
          applicativo: {
            applicativoId: applicativoId,
          },
          oggetto: oggettoParsed,
          statoRichiestaConsap: {
            statoRichiestaConsapId: statoRichiestaConsapParsed,
          },
          dataCreazione: dataCreazioneParsed,
          statoApprovazioneConsap: {
            statoApprovazioneConsapId: statoApprovazioneConsapParsed,
          },
          statoApprovazioneOs: {
            statoApprovazioneOsId: statoApprovazioneOsParsed,
          },
          statoRichiestaOs: {
            statoRichiestaOsId: statoRichiestaOsParsed,
          },
          dataStimaFinale: dataStimaFinaleParsed,
          importo: importoParsed,
          commessaOs: {
            commessaOsId: commessaOsParsed,
          },
        },
      ],
    };

    this.richiestaService.modificaRichiesta(dati).subscribe(
      (data) => {
        console.log('RICHIESTA MODIFICATA:', data);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  reload() {
    window.location.reload();
  }

  openModifica() {
    const modal = document.getElementById('modalOpenModifica');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeModifica() {
    const modal = document.getElementById('modalOpenModifica');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }
  openConferma() {
    const modal = document.getElementById('modalConfermaModifica');
    if (modal) {
      this.closeModifica();
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeConferma() {
    const modal = document.getElementById('modalConfermaModifica');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
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
