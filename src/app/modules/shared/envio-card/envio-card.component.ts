import { Component, OnInit, Input, Output } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TrackingComponent } from '../modals/tracking/tracking.component';

@Component({
  selector: 'app-envio-card',
  templateUrl: './envio-card.component.html',
  styleUrls: ['./envio-card.component.scss']
})
export class EnvioCardComponent implements OnInit {

  @Input() envioWrapper: any;
  

  constructor(
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
  }

  mostrarTracking(): void {
    let bsModalRef: BsModalRef = this.modalService.show(TrackingComponent, {
      initialState: {
        envioId: this.envioWrapper.data.id
      }
    });


  }

}
