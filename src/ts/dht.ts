// calculate sha1 hash of input string
function sha1(input:string) : string
{
    var crypto = require('crypto');
    var shasum = crypto.createHash('sha1');
    shasum.update(input);
    return shasum.digest('hex');
}

export interface HashTableCallback
{
    (error?:any, value?:string): void;
}

// Interface for our HashTables
export interface HashTable
{
    // Put a keyset into the HashTable, callback when done
    put(key:string, value:string, callback?:HashTableCallback) : void;
    // Get a value from the HashTable, callback when done
    get(key:string, callback?:HashTableCallback) : void;
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

    put(key:string, value:string, callback?:(err?:any, value?:string) => void) : void
    {
        var hash_key = sha1(key);
        var endpoint = this.server_url + 'put?id=' + hash_key;

        HTTP_HashTable.request.post(endpoint, {'form':{'value':value}},
            function(err:any, res:any, body:any)
        {
            callback(err, body);
        });
    }

    get(key:string, callback?:(err?:any, value?:string) => void) : void
    {
        var hash_key = sha1(key);
        var endpoint = this.server_url + 'get?id=' + hash_key;

        HTTP_HashTable.request.get(endpoint,
            function(err:any, res:any, body:any)
        {
            if(err)
            {
                console.error(err.message);
                callback(err);
                return;
            }
            callback(null,body);
            //console.log(res);
            console.log(body);
        });
    }
}
/*
class Distributed_HashTable implements HashTable
{
// TODO: Implement
}
*/
