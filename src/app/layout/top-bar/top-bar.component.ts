import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
import { FormGroup } from '@angular/forms';
import { SubmitForm } from 'src/app/utils/submit-form';
import { IDocflowRepository } from 'src/app/core/repository/docflow.repository';

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
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private menuRepository: IMenuRepository,
    private docflowRepository: IDocflowRepository,
    private submitForm: SubmitForm,
  ) { }

  public perfilSeleccionado: any;
  public dataSeleccionado: any;
  public textChange: any;
  confirmarSubscription: Subscription;
  @Output() BuzonUtdCreadoEvent = new EventEmitter<File>();
  public titulo: String;
  public integracionDocflow: boolean;


  async ngOnInit(): Promise<void> {

    AppConfig.DespuesDeInicializar(() => {
      this.integracionDocflow = AppConfig.INTEGRACION_DOCFLOW;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      AppConfig.DespuesDeInicializar(() => {
        this.menuRepository.listarNombreByRuta(this.router.url.split('?')[0]).subscribe(nombre => this.titulo = nombre);
      });

    });


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
