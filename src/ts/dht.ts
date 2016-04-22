/// <reference path="./sha1.ts"/>

import { sha1 } from './sha1';

export interface HashTableCallback
{
    (error?:any, value?:string): void;
}

// Interface for our HashTables
export interface HashTable
{
    // Put a keyset into the HashTable, callback when done
    put(key:string, value:string, callback?:HashTableCallback) : void;
    put_raw(hash:string, value:string, callback?:HashTableCallback) : void;
    // Get a value from the HashTable, callback when done
    get(key:string, callback?:HashTableCallback) : void;
    get_raw(hash:string, callback?:HashTableCallback) : void;
}

// Fake distributed HashTable via. centralized server
export class HTTP_HashTable implements HashTable
{
    // Static reference to the request library
    static request = require('request');
    // Centralized server IP
    server_url:string;

    constructor()
    {
        // TODO: We should take this as an argument
        this.server_url = 'http://localhost:3000/';
    }

    put_raw(hash:string, value:string, callback?:(err?:any, value?:string) => void) : void
    {
        var endpoint = this.server_url + 'put?id=' + hash;

        HTTP_HashTable.request.post(endpoint, {'form':{'value':value}},
            function(err:any, res:any, body:any)
        {
            if(err)
            {
                console.error(err.message);
                callback(err);
                return;
            }
             if(res.statusCode !== 200)
            {
                console.log(body);
                callback(body);
                return;
            }
            callback(null, body);
            console.log(body);
        });
    }

    put(key:string, value:string, callback?:(err?:any, value?:string) => void) : void
    {
        var hash_key = sha1(key);
        this.put_raw(hash_key, value, callback);
    }

    get_raw(hash:string, callback?:(err?:any, value?:string) => void) : void
    {
        var endpoint = this.server_url + 'get?id=' + hash;

        HTTP_HashTable.request.get(endpoint,
            function(err:any, res:any, body:any)
        {
            if(err)
            {
                console.error(err.message);
                callback(err);
                return;
            }
            if(res.statusCode !== 200)
            {
                console.log(body);
                callback(body);
                return;
            }
            callback(null,body);
            console.log(body);
        });
    }

    get(key:string, callback?:(err?:any, value?:string) => void) : void
    {
        var hash_key = sha1(key);
        this.get_raw(hash_key, callback);
    }
}

/*
export class Distributed_HashTable implements HashTable
{
// TODO: See chord-dht.ts
}
*/
