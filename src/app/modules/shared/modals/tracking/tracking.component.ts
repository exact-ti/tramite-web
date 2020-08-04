import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IEnvioRepository } from 'src/app/core/repository/envio.repository';
import { take } from 'rxjs/operators';
import { CargoComponent } from '../cargo/cargo.component';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    public envioRepository: IEnvioRepository,
    public modalService: BsModalService,
  ) { }

  envioId: number;
  detalle: any = {};
  seguimientos: any[] = [];

  ngOnInit(): void {
    this.envioRepository.listarDetalle(this.envioId).pipe(take(1)).subscribe(data => this.detalle = data);
    this.envioRepository.listarSeguimientos(this.envioId).pipe(take(1)).subscribe(data => 
      this.seguimientos =  data.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      );
  }

  abrirCargo(seguimiento): void {
    let initialState = {
      cargo: seguimiento.cargo,
      paqueteId: this.detalle.paqueteId,
      destinatario: this.detalle.destinatario,
    };

    let bsModalRef: BsModalRef = this.modalService.show(CargoComponent, {
      initialState,
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });
  }

  ç

}
