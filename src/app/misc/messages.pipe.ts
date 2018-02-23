import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash'
@Pipe({
  name: 'messages'
})
export class MessagesPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return _.filter(value, (item) => item.text)
  }

}
