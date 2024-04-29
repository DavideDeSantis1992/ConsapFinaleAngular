import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-headerlogin',
  templateUrl: './headerlogin.component.html',
  styleUrl: './headerlogin.component.css',
})
export class HeaderloginComponent {
  @HostListener('keydown.Tab', ['$event'])
  handleTab(event: KeyboardEvent) {
    event.preventDefault();
  }
}
