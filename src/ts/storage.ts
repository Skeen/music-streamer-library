var localForage = require('localForage');

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
	(error?:any, keys:string[]): void;
}

import {Song, Album, Artist} from './music';

export public class Storage
{
	public static addSong(song: Song, callback:storageAddCallback): string
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
					log("Added song info to localForage!");
					saveBlob(hash, blob, 
							 function(err:any, hash:string){callback(err, hash)});
				}
			});
	}

	public static getSong(hash: string, callback:storageGetCallback): Song
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
					log("Fetched song info from localForage!");
					getBlob(hash, song,
							function(err:any, song:Song){callback(err, song)});
				}
			});
	}

	public static getKeys(callback:storageKeysCallback)
	{
		localForage.keys(function(err:any, keys:string[])
		{
    		if(err) throw err;

		    var filtered_keys: string[] = keys.filter(function(key: string)
											{
												return key.startsWith('storage');
											})
    		callback(err, filtered_keys);
		});
	}

	private static saveBlob(hash:string, blob: Blob, callback:storageAddCallback): string
	{
		localForage.setItem('storage:'+hash, blob, function(err:any)
			{
				if (err)
				{
					throw err;
				}
				else
				{
					log("Added song blob to localForage!")
					callback(err, hash);
				}
			});
	}
	
	private static getBlob(hash:string, song:Song, callback:any): Blob
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
					log("Fetched song blon from localForage!");
					callback(err, song);
				}
			});
	}
}
