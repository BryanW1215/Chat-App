import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {IAppState} from '../store';
import {NgRedux} from '@angular-redux/store';
import * as _ from 'lodash';
export const actions = {
  AddOrUpdateUser: 'Users.AddOrUpdate'
};
@Injectable()
export class UsersService {
  users: Array<any>;
  usersRef: AngularFireList<any>;
  constructor(private ngRedux: NgRedux<IAppState>, private db: AngularFireDatabase) {

    this.usersRef = db.list('users');
    this.usersRef.snapshotChanges().subscribe(snapshotChanges => {
      this.users = [];
      _.each(snapshotChanges, snapshot =>{
        this.users.push({key: snapshot.key, email:snapshot.payload.val().email});
      });
      console.log(this.users);
    });
  }
  RemoveUser(email){
    let user = _.find(this.users, {email});
    if(!user)
      return;
    this.usersRef.remove(user.key);
  }
  AddOrUpdateUser(googleAccount: any){

    this.usersRef.push(googleAccount);
  }
}
