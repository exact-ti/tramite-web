import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { take } from 'rxjs/operators';
import { LocalStorage } from 'src/app/core/repository/local-storage';
import { AppConfig } from 'src/app/app.config';
import { IBuzonRepository } from 'src/app/core/repository/buzon.repository';
import { IPerfilRepository } from 'src/app/core/repository/perfil.repository';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModificarBuzonUtdComponent } from './modificar-buzon-utd/modificar-buzon-utd.component';
import { TipoPerfilEnum } from 'src/app/enum/tipoPerfil.enum';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  constructor(
    private buzonRepository: IBuzonRepository,
    private utdRepository: IUtdRepository,
    private perfilRepository: IPerfilRepository,
    private localStorageService: LocalStorage,
    private modalService: BsModalService,
  ) { }

  public perfilSeleccionado: any;
  public dataSeleccionado: any;
  public textChange: any;
  confirmarSubscription: Subscription;
  @Output() BuzonUtdCreadoEvent = new EventEmitter<File>();


  async ngOnInit(): Promise<void> {
    await this.cargarPerfil();
/*     AppConfig.DespuesDeInicializar(()=> this.cargarData());    
 */  }


  cargarData(): void {
    if (this.perfilSeleccionado.id == TipoPerfilEnum.CLIENTE) {
      this.cargarBuzones();
    } else {
      this.cargarUtds();
    }
  }


  cargarPerfil(): void {
    AppConfig.onInicialization.pipe(take(1)).subscribe(() => {
      this.perfilRepository.listarTipoPerfil().subscribe((data) => {
        this.perfilSeleccionado = data;
        if (this.perfilSeleccionado.id == TipoPerfilEnum.CLIENTE) {
          this.textChange="Cambiar de buzón";
          this.cargarBuzones();
        } else {
          this.textChange="Cambiar de UTD";
          this.cargarUtds();
        }
      })
    })
  }

  cargarUtds(): void {
    this.utdRepository.listarUtdSeleccionado().subscribe((utd) => {
      this.dataSeleccionado = utd;
    })
  }

  cargarBuzones(): void {
    this.buzonRepository.listarBuzonSeleccionado().subscribe((buzon) => {
      this.dataSeleccionado = buzon;
    })
  }

  cerrarSesion(): void {
    this.localStorageService.deleteTokens();
    window.location.href = AppConfig.LOGIN_URL;
  }

  modificarData() {
    let bsModalRef: BsModalRef = this.modalService.show(ModificarBuzonUtdComponent, {
      initialState: {
        perfilSeleccionado: this.perfilSeleccionado,
        dataSeleccionado: this.dataSeleccionado
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });
    bsModalRef.content.BuzonUtdCreadoEvent.subscribe(() =>
      this.cargarData(),
    );
  }

}
