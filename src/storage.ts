var localForage = require('localforage');
//var filter = require('lodash.filter');
require('string.prototype.startswith');

export interface storageAddCallback
{
    (error?:any, value?:string): void;
}

export interface storageGetCallback
{
	(error?:any, value?:Song): void;
}

export interface storageKeysCallback
{
	(error?:any, keys?:string[]): void;
}

import {Song, Album, Artist} from './music';
import {sha1} from './sha1';

export class Storage
{
	public static addSong(song: Song, callback:storageAddCallback): void
	{
		var hash:string = sha1(song.getTitle());

		var blob:Blob = song.getBlob();
		song.setBlob(null);

		localForage.setItem(hash, song, function(err:any)
			{
				if (err)
				{
					throw err;
				}
				else
				{
					Storage.saveBlob(hash, blob, 
							 function(err:any, hash:string){callback(err, hash)});
				}
			});
	}

	public static getSong(hash: string, callback:storageGetCallback): void
	{
		localForage.getItem(hash, function(err:any, song_value:any)
			{
				if(err) 
				{
					throw err;
				}
				else
				{
					var song:Song = Song.fromJSON(song_value);
					Storage.getBlob(hash, song, callback);
							//function(err:any, song:Song){callback(err, song)});
				}
			});
	}

	public static getKeys(callback:storageKeysCallback) : void
	{
		localForage.keys(function(err:any, keys:string[])
		{
    		if(err) throw err;
			
			// var filtered_keys: string[] = filter.filter(keys, 'storage');
			var filtered_keys: string[] = keys.filter(function(key:any)
													  {
													  	return !key.startsWith('storage:');
													  });
    		callback(err, filtered_keys);
		});
	}

	private static saveBlob(hash:string, blob: Blob, callback:storageAddCallback): void
	{
		localForage.setItem('storage:'+hash, blob, function(err:any)
			{
				if (err)
				{
					throw err;
				}
				else
				{
					callback(err, hash);
				}
			});
	}
	
	private static getBlob(hash:string, song:Song, callback:any): void
	{
		localForage.getItem("storage:"+hash, function(err:any, blob:Blob)
			{
				if (err)
				{
					throw err;
				}
				else
				{
					song.setBlob(blob);
					callback(err, song);
				}
			});
	}
}
