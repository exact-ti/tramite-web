import { Component, OnInit, forwardRef, Input, ElementRef, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-valid-select',
  templateUrl: './valid-select.component.html',
  styleUrls: ['./valid-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ValidSelectComponent),
      multi: true
    }
  ],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({opacity: 0}),
            animate('0.3s ease-out', 
                    style({opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({opacity: 1}),
            animate('0.3s ease-out', 
                    style({opacity: 0 }))
          ]
        ),
      ]
    )
  ],
})
export class ValidSelectComponent implements OnInit, ControlValueAccessor {

  constructor(
    private elementRef: ElementRef, 
  ) { }  

  value: any;
  @Input() isDisabled: boolean = false;
  onChange = (_:any) => {}
  onTouch = () => {}
  @Input() placeholder: string;
  @Input() valid: boolean;
  @Input() invalid: boolean;
  @Input() mensajeInvalido: string;  
  @Input() id: string = Math.floor(Math.random() * 100000).toString();
  @Input() label: string;
  @Input() items: string;
  @Input() atributo: string;

  ngOnInit(): void {
  }

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onSelected(value: any): void {
    this.value = value;
    this.onTouch();
    this.onChange(this.value);
    this.elementRef.nativeElement.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: value }));
  }

  

}
