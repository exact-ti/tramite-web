import { Component, OnInit, Input } from '@angular/core';
import { Buzon } from 'src/app/core/model/buzon.model';

@Component({
  selector: 'app-buzon-card',
  templateUrl: './buzon-card.component.html',
  styleUrls: ['./buzon-card.component.scss']
})

export class BuzonCardComponent implements OnInit {

  @Input() buzonWrapper: any;

  constructor() { }

  ngOnInit(): void {
    
  }

}
