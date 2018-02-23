import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {UUID} from 'angular2-uuid';
import {environment} from '../../environments/environment';

declare const Peer: any;

@Injectable()
export class PeerService {
  peer: any;
  public peerId = UUID.UUID();
  public OnMediaStream = new Subject();
  constructor() {
    this.peer = new Peer(this.peerId, {key: environment.peerKey, config: environment.webRTCConfig});
    this.peer.on('call', (call) => {
      // Answer the call, providing our mediaStream
      this.getMediaStream().then(mediaStream => {
        call.answer(mediaStream);
        this.bindOnStream(call);
      });
    });
  }

  public Call(peerId) {
    this.getMediaStream().then(mediaStream => {
      let call = this.peer.call(peerId,mediaStream);
      this.bindOnStream(call);
    });
  }
  bindOnStream(call){
    call.on('stream', stream =>{
      this.OnMediaStream.next(stream);
    })
  }
  getMediaStream() {
    return navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
  }
}
