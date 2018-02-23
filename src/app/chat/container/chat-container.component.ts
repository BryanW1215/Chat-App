import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../services/users.service';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent implements OnInit {
  selectedUser: any = null;
  constructor() { }

  ngOnInit() {
  }
  OnUserSelected(user){
    this.selectedUser = user;
  }
}
