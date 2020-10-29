import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment-timezone';
import { UtilsService } from 'src/app/utils/utils';


@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent ),
      multi: true
    }
  ],
})
export class DatepickerComponent implements ControlValueAccessor {

  constructor(
    private utils: UtilsService,
  ) { }
  
  value: any;
  onChange = (_:any) => {}
  onTouch = () => {}
  @Input() isDisabled: boolean = false;
  @Input() label;
  @Input() placeholder = 'Escoja la fecha';
  
  public _minDate;
  public _maxDate;


  @Input() set minDate (minDate) {
    this._minDate = this.utils.stringToDate(minDate);
  }
  @Input() set maxDate(maxDate) {
    this._maxDate = this.utils.stringToDate(maxDate);
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
    this.value = moment(value).format('DD/MM/YYYY');
    this.onTouch();
    this.onChange(this.value);
  }

}
