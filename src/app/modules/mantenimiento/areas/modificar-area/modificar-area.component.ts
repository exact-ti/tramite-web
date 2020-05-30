import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Area } from 'src/app/core/model/area.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-modificar-area',
  templateUrl: './modificar-area.component.html',
  styleUrls: ['./modificar-area.component.scss']
})
export class ModificarAreaComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
  ) { }

  area: Area;
  modificarForm: FormGroup;
  areas:Area[]=[];
  titulo : String;


  ngOnInit(): void {
    this.modificarForm = new FormGroup({
      'nombre': new FormControl(this.area.nombre, Validators.required),
      'region': new FormControl(null, Validators.required),
      'activo': new FormControl(this.area.activo, Validators.required)
    });
  }

  @Output() ambitoModificadoEvent = new EventEmitter();
  regionesSubscription: Subscription;
  modificarAmbitoSubscription: Subscription;
  onSubmit(form: any) {

  }

  cancelar() {
  }
}
