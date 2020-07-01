import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-utd-card',
  templateUrl: './utd-card.component.html',
  styleUrls: ['./utd-card.component.scss']
})
export class UtdCardComponent implements OnInit {

  constructor() { }
  @Input() utd: any;
  @Output() onClose = new EventEmitter();
  ngOnInit(): void {
  }

  close() {
    this.onClose.emit('close');
  }

}
