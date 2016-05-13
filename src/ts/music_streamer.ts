var mm = require('musicmetadata')
var hash_table:HashTable = new HTTP_HashTable();


import { HashTable, HTTP_HashTable } from './dht';
import { sha1 } from './sha1';
import { createSong, addSong } from './dht_overlay';
import { bufferToRenderable, Song, Album, Artist } from './music';
import { Storage } from './storage';
import { TorrentClient } from './torrent';

export class MusicStreamer
{
	public static parseFromDrop(file:any, magnetURI:string): void
	{
		var parser = mm(file, function(err:any, metadata:any)
		{
			if (err) throw err;
            addSong(metadata, torrent.magnetURI, hash_table, log);

            var song:Song = createSong(metadata, torrent.magnetURI);
            song.setFileName(file.name);
            song.setBlob(file);

            Storage.addSong(song, function(err:any, sha1:string)
            {
            	if (err) throw err;
		    });
		}
	}

	public static parseFromStream(file:any, magnetURI:string): void
	{
		var parser = mm(stream, {assumeStream: true}, 
			function(err:any, metadata:any)
			{
        	    if (err) throw err;	

    	        file.getBuffer(function(err:any, buffer:any)
    	        {
    	            if (err) throw err;

    	            function toArrayBuffer(buffer:any)
    	            {
    	                var ab = new ArrayBuffer(buffer.length);
    	                var view = new Uint8Array(ab);
    	                for (var i = 0; i < buffer.length; ++i) 
						{
       	            		view[i] = buffer[i];
       		    		}
                    	return ab;
                	}

                	var song:Song = createSong(metadata, magnetURI);
                	song.setFileName(file.name);
                	song.setBlob(new Blob([toArrayBuffer(buffer)]));

                	Storage.addSong(song, function(err:any, sha1:string)
                	{
                    	if(err) throw err;
					});
            	});
			});
	}
}
