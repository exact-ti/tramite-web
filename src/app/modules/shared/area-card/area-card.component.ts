import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-area-card',
  templateUrl: './area-card.component.html',
  styleUrls: ['./area-card.component.scss']
})
export class AreaCardComponent implements OnInit {

  constructor() { }

  @Input() area: any;
  @Output() onClose = new EventEmitter();

  ngOnInit(): void {
  }

  close() {
    this.onClose.emit('close');
  }

}
