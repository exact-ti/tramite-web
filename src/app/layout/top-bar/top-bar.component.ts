import { Component, OnInit } from '@angular/core';
import { Buzon } from 'src/app/core/model/buzon.model';
import { take } from 'rxjs/operators';
import { LocalStorage } from 'src/app/core/repository/local-storage';
import { AppConfig } from 'src/app/app.config';
import { IBuzonRepository } from 'src/app/core/repository/buzon.repository';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {  

  constructor(
    private buzonRepository: IBuzonRepository, 
    private localStorageService: LocalStorage, 
    ) { }

  public buzonSeleccionado: Buzon;


  ngOnInit(): void {
    this.cargarBuzones();
  }

  cargarBuzones(): void {
    AppConfig.onInicialization.pipe(take(1)).subscribe(()=> {
      this.buzonRepository.listarBuzonSeleccionado().subscribe((buzon) => {
        this.buzonSeleccionado = buzon;
      })
    })    
  }

  cerrarSesion(): void {
    this.localStorageService.deleteTokens();
    window.location.href = AppConfig.LOGIN_URL;
  }



}
