import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {UsersService} from '../../services/users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  users: Observable<any>;
  selectedUserEmail = '';
  @Output('on-selection') onSelectEmitter: EventEmitter<any> = new EventEmitter<any>();
  constructor(private db: AngularFireDatabase) {
    this.users = db.list('users').valueChanges();
  }
  SelectUser(user){
    this.selectedUserEmail = user.email;
    this.onSelectEmitter.emit(user);
  }
}
