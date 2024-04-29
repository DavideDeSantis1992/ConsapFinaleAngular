import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { LoginComponent } from './componenti/login/login.component';
import { HeaderComponent } from './componenti/header/header.component';
import { FooterComponent } from './componenti/footer/footer.component';
import { HomeComponent } from './componenti/home/home.component';
import { HeaderloginComponent } from './componenti/headerlogin/headerlogin.component';
import { HomeaccessoComponent } from './componenti/homeaccesso/homeaccesso.component';
import { HeaderaccessoComponent } from './componenti/headeraccesso/headeraccesso.component';
import { ElencoComponent } from './componenti/elenco/elenco.component';
import { InserimentoComponent } from './componenti/inserimento/inserimento.component';


import { IspezionaComponent } from './componenti/ispeziona/ispeziona.component';

import { ModificaComponent } from './componenti/modifica/modifica.component';

import { PercorsoComponent } from './componenti/percorso/percorso.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    HeaderloginComponent,
    HomeaccessoComponent,
    HeaderaccessoComponent,
    ElencoComponent,
    InserimentoComponent,
  
    IspezionaComponent,
   
    ModificaComponent,
    

    PercorsoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
