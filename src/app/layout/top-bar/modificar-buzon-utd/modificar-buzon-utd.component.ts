import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IBuzonRepository } from 'src/app/core/repository/buzon.repository';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { ConfirmModalComponent } from 'src/app/modules/shared/modals/confirm-modal/confirm-modal.component';
import { Subscription } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { TipoPerfilEnum } from 'src/app/enum/tipoPerfil.enum';
import { AppConfig } from 'src/app/app.config';
import { take, filter } from 'rxjs/operators';

@Component({
  selector: 'app-modificar-buzon-utd',
  templateUrl: './modificar-buzon-utd.component.html',
  styleUrls: ['./modificar-buzon-utd.component.css']
})

export class ModificarBuzonUtdComponent implements OnInit {
  constructor(
    public bsModalRef: BsModalRef,
    private buzonRepository: IBuzonRepository,
    private utdRepository: IUtdRepository,
    private modalService: BsModalService,
    private notifier: NotifierService
  ) { }

  confirmarSubscription: Subscription;
  modificarBuzonUtdSubscription: Subscription;
  @Output() BuzonUtdCreadoEvent = new EventEmitter<any>();

  envioId: number;
  detalle: any = {};
  items: any[] = [];
  perfilSeleccionado: any;
  dataSeleccionado: any;
  ngOnInit(): void {
    AppConfig.DespuesDeInicializar(() => this.cargarDatos());
  }

  cargarDatos(): void {
    if (this.perfilSeleccionado.id == TipoPerfilEnum.CLIENTE) {
      this.cargarBuzones();
    } else {
      this.cargarUtds();
    }
  }

  cargarUtds(): void {
    this.utdRepository.listarUtdsdelUsuario().pipe(take(1)).subscribe((data) => {
      this.items = data;
    });
  }

  cargarBuzones(): void {
    this.buzonRepository.listarBuzonesDelUsuario().pipe(take(1)).subscribe((data) => {
      this.items = data;
    })
  }

  cerrar() {

    this.bsModalRef.hide();
  }


  seleccionarItem(value: any) {
    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        mensaje: this.perfilSeleccionado.id == 1 ? "¿Está seguro que desea modificar su buzón?" : "¿Está seguro que desea modificar su UTD?"
      }
    });
    bsModalRef.content.confirmarEvent.pipe(take(1)).subscribe(() => {
      if (this.perfilSeleccionado.id == 1) {
        this.utdRepository.seleccionarUtd(value)
        this.notifier.notify('success', 'Se ha modificado la UTD correctamente');
        
        
      } else {
        this.buzonRepository.seleccionarBuzon(value);
        this.notifier.notify('success', 'Se ha modificado el buzón correctamente');
      }
      this.BuzonUtdCreadoEvent.emit();
      setTimeout(()=>{
        this.bsModalRef.hide();
      }, 100);
    });
  }
}

