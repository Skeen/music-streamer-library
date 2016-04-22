/// <reference path="./dht.ts"/>

import { HashTable } from './dht';
import { sha1 } from './sha1';
var explorer = require('webrtc-explorer');

export class Distributed_HashTable implements HashTable
{
  //TODO: Implement
  //console.log('start');
  private config: any;
  private peer: any;

  constructor(){
    this.config = {
    signalingURL: 'http://localhost:3000',
    logging: true
    };

    this.peer = new explorer(this.config);
    //Do we need a global peer?
    //peerGlobal = peer;

    this.peer.events.on('registered', function(data: any) {
      console.log('registered with Id:', data.peerId);
    });

    this.peer.events.on('ready', function() {
      console.log('ready to send messages'); 
    });

    this.peer.events.on('message', function(envelope:any) {
      console.log(envelope);
    });

    this.peer.register();
  }
   put(key:string, value:string, callback?:(err?:any, value?:string) => void) : void
    {

    }

    get(key:string, callback?:(err?:any, value?:string) => void) : void
    {

    }
}
window['dst'] = Distributed_HashTable;
window['magica'] = function() { console.log("LOL");}