import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {

  transform(email: string, args?: any): any {
    let user = _.find(args, {email});
    return user.first_name;
  }

}
