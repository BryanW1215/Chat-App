import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {IAppState} from '../../store';
import {NgRedux} from '@angular-redux/store';
import {SessionService} from '../../services/session.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {
  subscriptions: Array<Subscription> = [];
  session: any;

  constructor(private ngRedux: NgRedux<IAppState>, private sessionService: SessionService) {
    this.subscriptions.push(this.ngRedux.select(state => state.session).subscribe(session => this.session = session));
  }
  Login(){
    this.sessionService.Login();
  }
  Logout(){
    this.sessionService.Logout();
  }
  ngOnInit() {
  }

}
