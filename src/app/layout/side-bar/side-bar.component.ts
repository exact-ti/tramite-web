import { Component, OnInit, OnDestroy } from '@angular/core';
import { take } from 'rxjs/operators';
import { Menu } from 'src/app/core/model/menu.model';
import { IMenuRepository } from 'src/app/core/repository/menu.repository';
import { Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit, OnDestroy {

  constructor(
    private menuRepository: IMenuRepository
  ) { }

  public menu: Menu[];
  

  ngOnInit(): void {
    this.inicializarMenu();
  }

  
  inicializarMenu(): void {
    AppConfig.onInicialization.pipe(take(1)).subscribe(()=> {
      this.menuRepository.listarMenu().pipe(take(1)).subscribe(
        (menu: Menu[]) => {
          this.menu = menu;
        }
      )
    });    
  } 
  
  ngOnDestroy(): void {
  }
  

}
