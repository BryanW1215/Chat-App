import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database-deprecated';
import {environment} from '../environments/environment';
import {IAppState, rootReducer} from './store';
import {DevToolsExtension, NgRedux, NgReduxModule} from '@angular-redux/store';
import * as persistState from 'redux-localstorage';
import {SessionService} from './services/session.service';
import { ChatContainerComponent } from './chat/container/chat-container.component';
import { NavMenuComponent } from './shared/nav-menu/nav-menu.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {UsersService} from './services/users.service';
import {AngularFireDatabase} from 'angularfire2/database';
import { UserListComponent } from './chat/user-list/user-list.component';
import { ChatComponent } from './chat/chat/chat.component';
import { ShortDateTimePipe } from './misc/short-date-time.pipe';
import { UserPipe } from './misc/user.pipe';
import {FormsModule} from '@angular/forms';
import { MessagesPipe } from './misc/messages.pipe';
import {PeerService} from './services/peer.service';

declare const window: any;
@NgModule({
  declarations: [
    AppComponent,
    ChatContainerComponent,
    NavMenuComponent,
    UserListComponent,
    ChatComponent,
    ShortDateTimePipe,
    UserPipe,
    MessagesPipe
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    NgReduxModule,
    FormsModule
  ],
  providers: [SessionService, UsersService, AngularFireDatabase, PeerService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(ngRedux: NgRedux<IAppState>, devTools: DevToolsExtension) {
    window.ngRedux = ngRedux;
    let reduxDevToolsExtensionInstalled = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__();
    let enhancers = [persistState()];
    !environment.production && reduxDevToolsExtensionInstalled && enhancers.push(devTools.enhancer());
    ngRedux.configureStore(rootReducer, {}, [], enhancers);
  }
}
