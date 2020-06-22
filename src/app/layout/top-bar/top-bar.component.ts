import { Component, OnInit } from '@angular/core';
import { Buzon } from 'src/app/core/model/buzon.model';
import { take, filter } from 'rxjs/operators';
import { LocalStorage } from 'src/app/core/repository/local-storage';
import { AppConfig } from 'src/app/app.config';
import { IBuzonRepository } from 'src/app/core/repository/buzon.repository';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { IMenuRepository } from 'src/app/core/repository/menu.repository';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {  

  constructor(
    private buzonRepository: IBuzonRepository, 
    private localStorageService: LocalStorage, 
    private router: Router,
    private menuRepository: IMenuRepository,
    ) { }

  public buzonSeleccionado: Buzon;
  public titulo: string = "TITULO";


  ngOnInit(): void {
    this.cargarBuzones();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd) 
    ).subscribe(() => {
      let url = this.router.url;
      this.titulo = this.menuRepository.listarNombreByRuta(url); 
    });
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
