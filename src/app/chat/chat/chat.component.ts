import {Component, ElementRef, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {IAppState} from '../../store';
import {NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import * as _ from 'lodash';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';
import {WebRTC} from '../../misc/web-rtc';
import {FirebaseSocket} from '../../misc/firebase-socket';
import {PeerService} from '../../services/peer.service';

declare const document: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnChanges, OnDestroy {
  @Input('user') withUser: any;
  myUser: any;
  userArray = [];
  messages: Observable<any>;
  subscriptions: Array<Subscription> = [];
  rtcList = '';
  text = '';
  messageListRef: AngularFireList<any>;
  //firebaseSocket: FirebaseSocket;

  /*
  webRTC: WebRTC;
  videoStream: any;
*/
  constructor(private ngRedux: NgRedux<IAppState>, private db: AngularFireDatabase, private peerService: PeerService) {

  }

  ngOnInit() {

  }

  ngOnChanges() {
    this.init();
  }

  init() {

    // Clean out data from previous chat window
    this.ngOnDestroy();

    // Get lists for messages and web rtc
    this.myUser = this.ngRedux.getState().session.user;
    this.userArray = [this.myUser, this.withUser];
    let sortedEmailArray = _.map(_.sortBy(this.userArray, 'email'), (user) => user.email.replace(/\./g, ''));
    let listId = sortedEmailArray.join('-');
    this.messageListRef = this.db.list(listId);
    this.messages = this.messageListRef.valueChanges();
/*
    this.firebaseSocket = new FirebaseSocket(this.messageListRef);
    this.subscriptions.push(this.firebaseSocket.OnMessage.subscribe((data) => this.onFirebaseEvent(data)));
    this.subscriptions.push(this.peerService.OnMediaStream.subscribe(mediaStream => {
      let video = document.querySelector('video');
      video.src = URL.createObjectURL(mediaStream);
      video.oncanplay = () => video.play();
    }));

    this.webRTC = new WebRTC(this.firebaseSocket);
*/
  }
/*
  onFirebaseEvent(data) {
    if (data.initializeWebRTC)
      this.peerService.Call(data.initializeWebRTC);
  }

  StartVideoChat() {
    this.firebaseSocket.Send({initializeWebRTC: this.peerService.peerId});

  }
*/
  OnKeyPress($event) {
    if ($event.keyCode !== 13)
      return;
    this.messageListRef.push({time: moment().unix(), email: this.myUser.email, text: this.text});
    this.text = '';


  }

  ngOnDestroy() {
    _.each(this.subscriptions, subscription => subscription.unsubscribe());
    //this.firebaseSocket && this.firebaseSocket.Destroy();
    //this.webRTC && this.webRTC.Destroy();
  }
}
