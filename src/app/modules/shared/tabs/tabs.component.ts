import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  @Input() tabs: string[]; 
  @Input() tabActiva: string;

  @Output() tabCambiado = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  activarTab(item): void {
    if (item === this.tabActiva) {
      return;
    }
    this.tabActiva = item;
    this.tabCambiado.emit(item);
  }

}
