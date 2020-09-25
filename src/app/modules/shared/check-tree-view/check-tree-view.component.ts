import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */

export interface ITree {
  id: number;
  nombre: string;
  checked: boolean;
  children: ITree[];
}

@Component({
  selector: 'app-check-tree-view',
  templateUrl: './check-tree-view.component.html',
  styleUrls: ['./check-tree-view.component.css']
})
export class CheckTreeViewComponent {

  @Input() tree: ITree[] = [];
  @Output() checkedChanged: EventEmitter<void> = new EventEmitter<void>();

  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();


  constructor() {
    
  }

  actualizarDataSource() {
    setTimeout(() => {
      this.dataSource.data = this.tree;
    }, 0);
  }

  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

  checkToggle(node) {
    node.checked = !node.checked;    
    this.prolongarToggleAPadre(node);
    this.prolongarToggleAHijos(node);
    this.checkedChanged.emit();
  }

  prolongarToggleAHijos(node): void {
    if (this.hasChild(0, node)) {
      node.children.forEach(element => {
        element.checked = node.checked;
        this.prolongarToggleAHijos(element);
      });
    }
  }

  prolongarToggleAPadre(node): void {
    let padre = this.encontrarPadreDelNodo(node, this.tree);
    if (padre) {
      if (node.checked && padre.children.findIndex(item => !item.checked) == -1) {
        padre.checked = node.checked;
        this.prolongarToggleAPadre(padre);
      } else if (!node.checked && padre.children.findIndex(item => !item.checked) >= 0) {
        padre.checked = node.checked;
        this.prolongarToggleAPadre(padre);
      }
    }
  }

  encontrarPadreDelNodo(node: any, nodes: any[]): any {
    for (let i = 0; i < nodes.length; i++) {
      if (!nodes[i].children) continue;
      for (let j = 0; j < nodes[i].children.length; j++) {
        if (nodes[i].children[j] == node) {
          return nodes[i];
        } else {
          if (nodes[i].children[j].children) {
            let encontrado = this.encontrarPadreDelNodo(node, nodes[i].children);
            if (encontrado) {
              return encontrado;
            }
          }
        }
      }
    }
    return null;
  }

  hijosChecked(node: any): boolean {
    if (node.children.findIndex(item => !item.checked) == -1) {
      return true;
    }
    return false;
  }

  isIndeterminate(node: any): boolean {
    if (this.hasChild(0, node)) {

      let unChecked = 0;
      let checked = 0;

      node.children.forEach(element => {
        if (!!element.checked) {
          checked++;
        } else {
          unChecked++;
        }
      });

      return unChecked * checked > 0;

    } else {
      return false;
    }
  }

}
