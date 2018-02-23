import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment'
@Pipe({
  name: 'shortDateTime'
})
export class ShortDateTimePipe implements PipeTransform {
  format = 'M/D/YY hh:mma';
  transform(value: number, args?: any): any {
    return moment.unix(value).format(this.format);
  }

}
