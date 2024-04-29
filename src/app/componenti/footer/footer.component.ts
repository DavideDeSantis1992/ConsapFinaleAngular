import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  @HostListener('keydown.Tab', ['$event'])
  handleTab(event: KeyboardEvent) {
    event.preventDefault();
  }
}
