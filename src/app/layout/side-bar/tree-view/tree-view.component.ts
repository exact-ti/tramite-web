import { Component, Input } from '@angular/core';
import { Menu } from 'src/app/core/model/menu.model';
import { IconoEnum } from 'src/app/enum/icono.enum';

@Component({
  selector: "[app-tree-view]",
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent {

  public iconoEnum = IconoEnum;

  @Input() menu: Menu[];
  @Input() nivel: number;

}
