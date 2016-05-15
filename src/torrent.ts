var WebTorrent = require('webtorrent');

var client = new WebTorrent();

client.on('error', function(err:any)
{
	console.error('ERROR: ' + err.message);
});

export interface LogTorrent
{
	(torrent:any) : void;
}

export interface PrintTorrent
{
	(name:string, infoHash:string, magnetURI:string, torrentFileBlobURL:string) : void;
}

export interface StreamCallback
{
	//TODO: What is type? Unsure what is used in WebTorrent.
	(stream:any, magnetURI:string) : void;
}

export interface ProgressDownloadCallback
{
	(speed:number, progress:number, time_left:number) : void;
}

export interface ProgressUploadCallback
{
	(speed:number, bytes_uploaded:number, num_peers:number) : void;
}

export class TorrentClient
{
	public static download_song(magnetURI: string, callback: StreamCallback,
							logT?: LogTorrent, print?:PrintTorrent,
                            progress?:ProgressDownloadCallback)
	{
		client.add(magnetURI, function(torrent:any)
        {
            if(print) // Allows printing info about the torrent.
            {
                print(torrent.name,torrent.infoHash,
                      torrent.magnetURI,torrent.torrentFileBlobURL);
            }
            if(progress)
            {
                torrent.on('download', function(bytes:number)
                {
                    progress(torrent.downloadSpeed, torrent.progress, torrent.timeRemaining);
                })
                torrent.on('done', function()
                {
                    progress(0, 1, 0);
                });
            }
            if(logT)
            {
                logT(torrent);
            }
            
            //Invariant: torrent can only contain one file
            if(torrent.files.length > 1)
            {
                console.error("Invariant breached! "
                            + "Torrent contains more than one file.");
            }

            // Return the stream of downloading files via callback.
            torrent.files.forEach(callback, magnetURI);
        });
	}

	public static seed_song(song: Blob, logT?:LogTorrent, print?:PrintTorrent, progress?:ProgressUploadCallback)
	{
		client.seed(song, function(torrent:any)
        {
            //Invariant: torrent can only contain one file
            if(torrent.files.length > 1)
            {
                console.error("Invariant breached! "
                            + "Torrent contains more than one file.");
            }
            if(print) // Allows printing info about the torrent.
            {
                print(torrent.name,torrent.infoHash,
                      torrent.magnetURI,torrent.torrentFileBlobURL);
            }
            if(progress)
            {
                torrent.on('upload', function (bytes:number)
                {
                    progress(torrent.uploadSpeed, torrent.uploaded, torrent.numPeers);
                });
            }
            if(logT)
            {
                logT(torrent);
            }
        });
	}
}
