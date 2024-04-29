import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-percorso',
  templateUrl: './percorso.component.html',
  styleUrl: './percorso.component.css'
})
export class PercorsoComponent {

  @Input() breadcrumbNames: string[] = [];
  
    constructor(private router: Router) {
    }
  
    getLinkForBreadcrumb(name: string): string {
        // Implementa la logica per ottenere il percorso corretto per ogni nome di breadcrumb
        // Ad esempio, se i nomi dei breadcrumb corrispondono ai nomi delle rotte:
        // console.log("Nome breadcrumb: ", name);
        
        switch (name) {
            case 'Home':
                return '/homeaccesso';
            case 'Elenco':
                return '/elenco';
            case 'Modifica':
                return '/modifica';
            default:
                return '/';
        }
    } 

}
