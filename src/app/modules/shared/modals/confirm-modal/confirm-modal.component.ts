import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  constructor(public bsModalRefConfirmar: BsModalRef) {}

  @Output() confirmarEvent = new EventEmitter();
  titulo: string;
  mensaje: string;
  mensaje2: string;
  mensaje3: string;

  ngOnInit() {
  }

  confirmar(){
    this.confirmarEvent.emit();
    this.bsModalRefConfirmar.hide();
  }

}
