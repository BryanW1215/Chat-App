import {AngularFireList} from 'angularfire2/database';
import {UUID} from 'angular2-uuid';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import moment = require('moment');
import * as _ from 'lodash';


export class FirebaseSocket {
  id = UUID.UUID();
  subscription: Subscription;
  lastTimeParsed: number = 0;
  public OnMessage = new Subject();

  constructor(private list: AngularFireList<any>) {
    this.subscription = this.list.snapshotChanges().subscribe(snapshotArray => {
      _.each(snapshotArray, snapshot => {
        let value = snapshot.payload.val();
        if (value.senderId === this.id || value.text || value.time < this.lastTimeParsed)
          return;
        this.lastTimeParsed = value.time;
        this.list.remove(snapshot.key);
        this.OnMessage.next(value.data);
      });
    });
  }

  public Send(data) {
    this.list.push({senderId: this.id, data: data, time: moment().unix()});
  }
  public Destroy(){
    this.subscription.unsubscribe();
  }
}
