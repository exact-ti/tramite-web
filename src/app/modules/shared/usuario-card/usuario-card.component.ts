import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-usuario-card',
  templateUrl: './usuario-card.component.html',
  styleUrls: ['./usuario-card.component.css']
})
export class UsuarioCardComponent implements OnInit {

  constructor() { }
  @Input() wrapper: any;
  @Output() onClose = new EventEmitter();
  mostrar : any;
  ngOnInit(): void {
  }

  close() {
    this.onClose.emit('close');
  }

}
