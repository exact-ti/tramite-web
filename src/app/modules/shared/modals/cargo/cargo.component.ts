import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.css']
})
export class CargoComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
  ) { }

  cargo: any = {};
  paqueteId: string;
  destinatario: string;

  ngOnInit(): void {
  }

  


}
