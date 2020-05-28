import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-nueva-area',
  templateUrl: './nueva-area.component.html',
  styleUrls: ['./nueva-area.component.scss']
})
export class NuevaAreaComponent implements OnInit {

  constructor(    public bsModalRef: BsModalRef,
    ) { }
  agregarForm: FormGroup;

  ngOnInit(): void {
    this.agregarForm = new FormGroup({
      'nombre': new FormControl('', Validators.required),
      'region': new FormControl('', Validators.required)
    })
  }
  regiones: any[] = [];
  @Output() ambitoCreadoEvent = new EventEmitter<any>();

  onSubmit(ambito) {

  }

  cancelar() {
  }
}
