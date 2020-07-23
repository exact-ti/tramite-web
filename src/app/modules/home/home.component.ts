import { Component, OnInit } from '@angular/core';
import { IMenuRepository } from 'src/app/core/repository/menu.repository';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { flatMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public menuRepository: IMenuRepository, public router: Router) { }

  ngOnInit(): void {

    if (!AppConfig.API) {
      AppConfig.onInicialization.pipe(flatMap(() => this.menuRepository.listarMenuPrincipal())).pipe(take(1)).subscribe((menu) => {
        this.router.navigate([menu.link]);
      });
    }
    this.menuRepository.listarMenuPrincipal().pipe(take(1)).subscribe((menu) => {
      this.router.navigate([menu.link]);
    });

  }

}
