import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-valid-input',
  templateUrl: './valid-input.component.html',
  styleUrls: ['./valid-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ValidInputComponent),
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
export class ValidInputComponent implements OnInit, ControlValueAccessor  {

  value: string;
  @Input() isDisabled: boolean;
  onChange = (_:any) => {}
  onTouch = () => {}
  @Input() placeholder: string;
  @Input() valid: boolean;
  @Input() invalid: boolean;
  @Input() mensajeInvalido: string;
  @Input() nombre: string;
  @Input() id: string = Math.floor(Math.random() * 100000).toString();
  @Input() label: string;
  @Input() tipo: string;

  constructor() { }


  writeValue(obj: any): void {
    if (obj) {
      this.value = obj || '';
    }else{
      this.value = '';
    }
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

  ngOnInit(): void {
  }

  onInput(value: string): void {
    this.value = value.toUpperCase();
    this.onTouch();
    this.onChange(this.value);
  }

}
