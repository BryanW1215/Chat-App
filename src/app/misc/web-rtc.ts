import {FirebaseSocket} from './firebase-socket';
import {Subject} from 'rxjs/Subject';
import {environment} from '../../environments/environment';
import {Subscription} from 'rxjs/Subscription';

export class WebRTC{
  pc: any;
  onRemoteVideoStream: Subject<any> = new Subject();
  onLocalVideoStream: Subject<any> = new Subject<any>();
  subscription: Subscription;
  constructor(private socket: FirebaseSocket){
    this.subscription = this.socket.OnMessage.subscribe((message) => this.onSocketData(message));

  }

  public StartWebRTC(isOfferer) {
    this.pc = new RTCPeerConnection(environment.webRTCConfig);
    this.pc.onicecandidate = event => {
      if (event.candidate) {
        this.socket.Send({'candidate': event.candidate});
      }
    };

    if (isOfferer) {
      this.pc.onnegotiationneeded = () => {
        this.pc.createOffer().then((offer)=>this.localDescCreated(offer)).catch(this.onError);
      }
    }

    this.pc.onaddstream = event => {
      this.onRemoteVideoStream.next(event.stream);
    };

    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    }).then(stream => {
      this.onLocalVideoStream.next(stream);
      this.pc.addStream(stream);
    }, this.onError);
  }

  onSocketData(message) {
      if (message.sdp) {
        this.pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
          if (this.pc.remoteDescription.type === 'offer') {
            this.pc.createAnswer().then((off) =>this.localDescCreated(off)).catch(this.onError);
          }
        }, this.onError);
      } else if (message.candidate) {
        this.pc.addIceCandidate(
          new RTCIceCandidate(message.candidate), this.onSuccess, this.onError
        );
      }
  }

  localDescCreated(desc) {
    this.pc.setLocalDescription(
      desc,
      () => {
        this.socket.Send({'sdp': this.pc.localDescription})
      },
      this.onError
    );
  }

  onError(err){
    console.log(`WebRTC error: ${JSON.stringify(err)}` )
  }

  onSuccess(msg){
    console.log(`WebRTC success: ${JSON.stringify(msg)}` )
  }

  public Destroy(){
    this.subscription.unsubscribe();
  }
}
