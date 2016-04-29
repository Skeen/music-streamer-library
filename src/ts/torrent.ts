var WebTorrent = require('webtorrent');

var client = new WebTorrent();

export interface Log
{
	(print: string) : void;
}

export interface LogTorrent
{
	(torrent:any) : void;
}

export interface printTorrent
{
	(name:string, infoHash:string, magnetURI:string, torrentFileBlobURL:string) : void;
}

export interface StreamCallback
{
	//TODO: Is this type correct? Unsure what is used in WebTorrent.
	(stream:any) : void;
}

export class TorrentClient
{
	public static download_song(magnetURI: string, callback: StreamCallback, 
							log?: Log, logT?: LogTorrent, print?:printTorrent)
	{
		client.add(magnetURI, function(torrent:any)
			{
				if(log) // Standard log output.
				{	
					log('Got torrent metadata!');
				}
				if(print) // Allows printing info about the torrent.
				{
    				print(torrent.name,torrent.infoHash,
						  torrent.magnetURI,torrent.torrentFileBlobURL);
				}

				if(logT) // Allows to print however using the torrent.
				{
    				// Print out progress every 5 seconds
    				var interval = setInterval(function () 
					{
    		  			logT(torrent);
    				}, 5000);
					torrent.on('done', function()
					{
						logT(torrent);
						clearInterval(interval);
					});
				}
				else if(log) // Standard print output.
				{
					var interval = setInterval(function()
					{
						log('Progress: ' + (torrent.progress * 100).toFixed(1) + '%');
					}, 5000);
					torrent.on('done', function()
					{
						log('Progress: 100%');
						clearInterval(interval);
					});
				}
				
				//Invariant: torrent can only contain one file
				if(torrent.files.length > 1)
				{
					console.error("Invariant breached! "
							  	+ "Torrent contains more than one file.");
				}

				// Return the stream of downloading files via callback.
				torrent.files.forEach(callback);
			});
	}

	public static seed_torrent(song: Blob, log?: Log, logT?: LogTorrent)
	{
		client.seed(song, function(torrent:any)
			{
				if(logT)
				{
					torrent.on('wire', function(wire:any, addr:any)
					{
						logT(torrent);
					});
				}
				else if(log)
				{
					torrent.on('wire', function(wire:any, addr:any)
					{
						log('connected to peer with address ' + addr);
					});
				}
			});
	}

	// DEPRECATED: just as backup if doing something crazy.
	public static leech(magnetURI: string, callback:any)
	{
		client.add(magnetURI, callback);
	}

	public static seed(song: Blob, callback:any)
	{
		client.seed(song, callback);
	}
}
