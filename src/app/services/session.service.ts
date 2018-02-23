import {ApplicationRef, ChangeDetectorRef, Injectable} from '@angular/core';

import {IAppState} from '../store';
import {environment} from '../../environments/environment';
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import * as _ from 'lodash'
import {NgRedux} from '@angular-redux/store';
import {UsersService} from './users.service';
/**
 * Action creators in Angular 2. We may as well adopt a more
 * class-based approach to satisfy Angular 2's OOP idiom. It
 * has the advantage of letting us use the dependency injector
 * as a replacement for redux-thunk.
 */
declare const gapi: any;
export const actions = {
  login: 'SESSION.LOGIN',
  logout: 'SESSION_LOGOUT'
};
@Injectable()
export class SessionService {

  private serviceUrl: string = '';
  private sessionSubscription: Subscription;
  private isLoggedIn: boolean;
  private auth2: any;

  constructor(private ngRedux: NgRedux<IAppState>, private usersService: UsersService) {
    this.initGAPI().then(() => this.bindSessionState());
    this.syncSessions = _.debounce(this.syncSessions, 1000);
  }

  private bindSessionState() {
    this.sessionSubscription = this.ngRedux.select(state => state.session.isLoggedIn).subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      this.syncSessions();
    });
  }

  private initGAPI() {
    return new Promise((resolve) =>
      gapi.load('auth2', () => {
        window['auth2'] = this.auth2 = gapi.auth2.init({
          client_id: environment.googleId,
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        setTimeout(() => {
          this.auth2.isSignedIn.listen(() => this.syncSessions());
          resolve();
        }, 2000);
      }));
  }

  private syncSessions() {
    let gLoggedIn = this.auth2.isSignedIn.get();
    gLoggedIn && !this.isLoggedIn && this.sessionLogin();
    !gLoggedIn && this.isLoggedIn && this.sessionLogout();

  }

  private getAccountModel() {
    let googleUser = this.auth2.currentUser.get();
    let profile = googleUser.getBasicProfile();
    return {
      token: googleUser.getAuthResponse().access_token,
      first_name: profile.getGivenName(),
      last_name: profile.getFamilyName(),
      picture: profile.getImageUrl(),
      email: profile.getEmail()
    };
  }

  private sessionLogin() {
    let account = this.getAccountModel();
    let clonedAccount = _.clone(account);
    delete clonedAccount.token;
    this.usersService.AddOrUpdateUser(clonedAccount);
    this.ngRedux.dispatch({type: actions.login, payload: account});

  }

  private sessionLogout() {
    this.usersService.RemoveUser(this.ngRedux.getState().session.user.email);
    this.ngRedux.dispatch({type: actions.logout});
  }
  public Login() {
    this.auth2.signIn().then(() => this.sessionLogin());
  }

  public Logout() {
    this.auth2.signOut();
  }
}

