import { Component } from '@angular/core';
import {IAppState} from './store';
import {NgRedux} from '@angular-redux/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoggedIn: boolean =false;
  constructor(private ngRedux: NgRedux<IAppState>){
    this.ngRedux.select(state=>state.session.isLoggedIn).subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
  }
}
