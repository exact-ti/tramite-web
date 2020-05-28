import { Component, Input } from '@angular/core';
import { Menu } from 'src/app/core/model/menu.model';

@Component({
  selector: "[app-tree-view]",
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent {

  @Input() menu: Menu[];
  @Input() nivel: number;

}
