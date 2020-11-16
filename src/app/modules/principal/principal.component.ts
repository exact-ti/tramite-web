import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { IUsuarioRepository } from 'src/app/core/repository/usuario.repository';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  constructor(
    private usuarioRepository: IUsuarioRepository
  ) { }

  nombreUsuario: string = "";

  ngOnInit(): void {
    this.usuarioRepository.listarNombreDeUsuarioAutenticado().pipe(take(1)).subscribe(
      nombre => this.nombreUsuario = nombre
    )
  }

}
