import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-activo-switch',
  templateUrl: './activo-switch.component.html',
  styleUrls: ['./activo-switch.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ActivoSwitchComponent),
      multi: true
    }
  ],
})
export class ActivoSwitchComponent implements OnInit, ControlValueAccessor {

  constructor() { }

  value: string;
  @Input() isDisabled: boolean;
  onChange = (_:any) => {}
  onTouch = () => {}
  @Input() id: string = Math.floor(Math.random() * 100000).toString();
  
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

  onInput(value: string): void {
    this.value = value;
    this.onTouch();
    this.onChange(this.value);
  }


}
