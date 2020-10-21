import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { take, filter } from 'rxjs/operators';
import { LocalStorage } from 'src/app/core/repository/local-storage';
import { AppConfig } from 'src/app/app.config';
import { IBuzonRepository } from 'src/app/core/repository/buzon.repository';
import { IPerfilRepository } from 'src/app/core/repository/perfil.repository';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModificarBuzonUtdComponent } from './modificar-buzon-utd/modificar-buzon-utd.component';
import { TipoPerfilEnum } from 'src/app/enum/tipoPerfil.enum';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { IMenuRepository } from 'src/app/core/repository/menu.repository';
import { SubmitForm } from 'src/app/utils/submit-form';
import { IDocflowRepository } from 'src/app/core/repository/docflow.repository';
import { INotificacionRepository } from 'src/app/core/repository/notificacion.repository';
import { CambiarPasswordModalComponent } from './cambiar-password-modal/cambiar-password-modal.component';
import { IconoEnum } from 'src/app/enum/icono.enum';
import { Menu } from 'src/app/core/model/menu.model';

declare var $: any;

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit, OnDestroy {

  constructor(
    private buzonRepository: IBuzonRepository,
    private utdRepository: IUtdRepository,
    private perfilRepository: IPerfilRepository,
    private localStorageService: LocalStorage,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private menuRepository: IMenuRepository,
    private docflowRepository: IDocflowRepository,
    private submitForm: SubmitForm,
    private notificacionRepository: INotificacionRepository,
  ) { }

  ngOnDestroy(): void {
    if (this.notificacionesSubscription) {
      this.notificacionesSubscription.unsubscribe();
    }
  }

  public tipoPerfil: any;
  public dataSeleccionado: any;
  public textChange: any;
  confirmarSubscription: Subscription;
  @Output() BuzonUtdCreadoEvent = new EventEmitter<File>();
  public menu: any = {};
  public integracionDocflow: boolean;
  public notificaciones = [];
  private notificacionesSubscription: Subscription;
  public iconoEnum = IconoEnum;




  async ngOnInit(): Promise<void> {

    AppConfig.DespuesDeInicializar(() => {
      this.integracionDocflow = AppConfig.INTEGRACION_DOCFLOW;
      this.listarNotificacionesPendientes();
      this.notificacionesSubscription = this.notificacionRepository.escucharNotificacionesNuevas().subscribe(
        data =>
          this.notificaciones = data
      );
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      AppConfig.DespuesDeInicializar(() => {
        this.menuRepository.listarMenuByRuta(this.router.url.split('?')[0].split(';')[0]).subscribe(menu => this.menu = menu);
      });

    });

    this.onNotificacionesOpen();

    await this.cargarTipoPerfil();
  }




  cargarData(): void {
    if (this.tipoPerfil.id == TipoPerfilEnum.CLIENTE) {
      this.cargarBuzones();
    } else {
      this.cargarUtds();
    }
  }

  listarNotificacionesPendientes(): void {
    this.notificacionRepository.listarNotificacionesPendientesDelUsuario().pipe(take(1)).subscribe(
      rpta => {
        if (rpta.status == "success") {
          this.notificaciones = rpta.data;
        }
      }
    )
  }


  cargarTipoPerfil(): void {
    AppConfig.onInicialization.pipe(take(1)).subscribe(() => {
      this.perfilRepository.listarTipoPerfil().subscribe((data) => {
        this.tipoPerfil = data;
        if (this.tipoPerfil.id == TipoPerfilEnum.CLIENTE) {
          this.textChange = "Cambiar de buzón";
          this.cargarBuzones();
        } else {
          this.textChange = "Cambiar de UTD";
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

  ingresarDocflow() {
    this.docflowRepository.listarParametrosIngreso().subscribe(respuesta => {
      if (respuesta.status == "success") {
        let data = respuesta.data;
        this.submitForm.submit({
          method: "POST",
          action: "https://www.docflowconsultas.com.pe/siddf/webservice/UserLogin",
          target: "_blank",
        }, data);
      }
    });
  }

  private createHiddenElement(name: string, value: string): HTMLInputElement {
    const hiddenField = document.createElement('input');
    hiddenField.setAttribute('name', name);
    hiddenField.setAttribute('value', value);
    hiddenField.setAttribute('type', 'hidden');
    return hiddenField;
  }

  cerrarSesion(): void {
    this.localStorageService.deleteTokens();
    window.location.href = AppConfig.LOGIN_URL;
  }


  modificarData() {
    let bsModalRef: BsModalRef = this.modalService.show(ModificarBuzonUtdComponent, {
      initialState: {
        tipoPerfil: this.tipoPerfil,
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

  onNotificacionesOpen(): void {

    let element = document.querySelector('#alertsDropdown');
    let observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type == "attributes" && mutation.attributeName == "aria-expanded" && $('#alertsDropdown').attr('aria-expanded') == 'false' ) {
          this.notificacionRepository.actualizarVistoNotificacionesDelUsuario().pipe(take(1)).subscribe(
            () => this.notificaciones.forEach(notificacion => notificacion.estado.id = 2)
          );
        }
      });
    });

    observer.observe(element, {
      attributes: true
    });
  }

  onIngresoRutaNotificacion(notificacion: any): void {
    if (notificacion.estado.id != 3) {
      this.notificacionRepository.actualizarRevisionNotificacion(notificacion.id).pipe(take(1)).subscribe(
        () => this.notificaciones = this.notificaciones.filter(not => not.id != notificacion.id)
      )
    }
  }

  listarCantidadNotificacionesPendientes(): number {
    return this.notificaciones.filter(notificacion => notificacion.estado.id == 1).length;
  }

  cambiarPassword(): void {
    this.modalService.show(CambiarPasswordModalComponent);
  }

}
