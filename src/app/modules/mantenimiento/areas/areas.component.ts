import { Component, OnInit } from '@angular/core';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { Area } from 'src/app/core/model/area.model';
import { AppConfig } from 'src/app/app.config';
import { take } from 'rxjs/operators';
import { IAreaRepository } from 'src/app/core/repository/area.repository';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NuevaAreaComponent } from './nueva-area/nueva-area.component';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit {

  constructor(
    private modalService: BsModalService,
    private areaRepository: IAreaRepository
  ) { }

  public area: Area[];
  public enviosWrappers: any[] = [];

  ngOnInit(): void {
    this.inicializarAreas();
  }

  
  inicializarAreas(): void {
    AppConfig.onInicialization.pipe(take(1)).subscribe(()=> {
      this.areaRepository.listarAreasbySede().pipe(take(1)).subscribe(
        (data) => {
          this.enviosWrappers = data.map((elemento)=> {
            return this.addWrapper(elemento);
          });
        }
      )
    });    
  } 
  
  private addWrapper(data): {} {
    return {
      seleccionado: false,
      data
    }
  }

  onAgregar() {
    this.agregarAmbito();
  }

  agregarAmbito() {
    let bsModalRef: BsModalRef = this.modalService.show(NuevaAreaComponent, {
      initialState: {
        titulo: 'Agregar ámbito',
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });
    /*bsModalRef.content.ambitoCreadoEvent.subscribe(() =>
      this.listarAmbitos()
    )*/
  }
}
