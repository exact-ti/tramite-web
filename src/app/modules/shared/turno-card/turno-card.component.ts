import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-turno-card',
  templateUrl: './turno-card.component.html',
  styleUrls: ['./turno-card.component.scss']
})
export class TurnoCardComponent implements OnInit {

  constructor() { }

  @Input() turno: any;
  @Output() onClose = new EventEmitter();
  intervalo : any;
  ngOnInit(): void {
    this.intervalo = this.turno.horaInicio + " - " + this.turno.horaFin;
  }

  close() {
    this.onClose.emit('close');
  }

}
