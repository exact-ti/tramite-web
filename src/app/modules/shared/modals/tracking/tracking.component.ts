import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IEnvioRepository } from 'src/app/core/repository/envio.repository';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {

  

  constructor(
    public bsModalRef: BsModalRef,
    public envioRepository: IEnvioRepository,
  ) { }

  envioId: number;
  detalle: any = {};
  seguimientos: any[] = [];

  ngOnInit(): void {
    this.envioRepository.listarDetalle(this.envioId).pipe(take(1)).subscribe(data => this.detalle = data);
    this.envioRepository.listarSeguimientos(this.envioId).pipe(take(1)).subscribe(data => 
      this.seguimientos =  data.sort((b, a) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      );
  }

}
