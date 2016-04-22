var buffer = require('buffer');
var includes = require('array-includes');
var render = require('render-media');

function songToRenderable(song: Song)
{
	var sFileName: string = song.getFileName();
	var file =
		{
			name: sFileName,
			createReadStream: function(opts: any)
			{
				var start = opts.start;
				var end = opts.end;
			}
		}
	return file;
}

export class Playlist
{
	private name: string;
	private currentIndex: number;
	private songs: Song[];

	// TODO: future
	// Private key or other cryptography
	
	constructor(name: string, index?: number, songs?: Song[])
	{
		this.name = name;
		this.currentIndex = index || 0;
		this.songs = songs || [];
	}

	public getIndex(): number
	{
		return this.currentIndex;
	}

	public setIndex(i: number)
	{
		this.currentIndex = i;
	}

	public getSongs(): Song[]
	{
		return this.songs;
	}
}

export class Song
{
	// Values about this song:
	private title: string;
	private genre: string;
	private year: number;
	private duration: number;

	// Song belongs to: (hashes)
	private artists: string[];
	private album: string;

	// Finding this song in the net
	private magnet: string;

	// Data and filetype
	private buffer: Buffer;
	private fileName: string;
	private encoding: string;

	// duration should be in milliseconds.
	constructor(title: string, genre?: string, 
				year?: number, dur?: number,
<<<<<<< HEAD
				artists?: string[], album?: string,
				magnet?: string)
=======
				artists?: Artist[], album?: Album,
				magnet?: string, buffer?: Buffer, 
				fileName?: string, encoding?: string)	
>>>>>>> 3acda5c6f46a3c2d7a9a6221ffc00cd02e4af056
	{
		this.title = title;
		this.genre = genre 		|| null;
		this.year = year 		|| null;
		this.duration = dur		|| null;
		this.artists = artists 	|| [];
		this.album = album 	    || null;
		this.magnet = magnet	|| null;
		this.buffer = buffer	|| null;
		this.fileName = fileName|| null;
		this.encoding = encoding|| null;
	}

	private getEncodingFromFilename()
	{
		// If encoding is not set, get from filename if valid
		if(this.encoding == null && this.fileName != null)
		{
			var fnSplit = this.fileName.split('.');
			var fileExt = fnSplit.pop();
			if(fileExt == '.wav' || '.aac' || '.ogg' || '.oga')
			{
				this.encoding = fileExt;
			}
		}
	}

	public getFileName() : string
	{
		return this.fileName;
	}

	public getBuffer() : Buffer
	{
		return this.buffer;
	}

	public setBuffer(buffer: Buffer)
	{
		this.buffer = buffer;
	}

	public getEncoding() : string
	{
		return this.encoding;
	}

	public setEncoding(enc: string)
	{
		this.encoding = enc;
	}

	public getTitle() : string
	{
		return this.title;
	}

	public getGenre() : string
	{
		return this.genre;
	}

	public getYear() : number
	{
		return this.year;
	}

	public getDuration(): number
	{
		return this.duration;
	}
/*
	public getArtist(): Artist[]
	{
		return this.artists;
	}

	public setArtist(artists: Artist[])
	{
		this.artists = artists;
	}

	public addArtist(artist: Artist)
	{
		this.artists.push(artist);
	}

	public getAlbum() : Album
	{
		return this.album;
	}

	public setAlbum(album: Album)
	{
		this.album = album;
	}
    */

	public getMagnet(): string
	{
		return this.magnet;
	}

	public setMagnet(magnet: string)
	{
		this.magnet = magnet;
	}
}

export class Artist
{
	private name: string;
	//private songs: Song[];
	private albums: string[];

	//constructor(name: string, songs?: Song[], albums?: Album[])
	constructor(name: string, albums?: string[])
	{
		this.name = name;
		//this.songs = songs 	|| [];
		this.albums = albums|| [];
	}

    static fromJSON(obj:any)
    {
        return new Artist(obj.name, obj.albums);
    }

    public getName(): string
    {
        return this.name;
    }

    public addAlbumHash(album: string): boolean
    {
        if(includes(this.albums, album))
        {
            return false;
        }
        this.albums.push(album);
        return true;
    }
}

export class Album
{
	private name: string;
	private songs: string[];
	private artists: string[];

	constructor(name: string, songs?: string[], artists?: string[])
	{
		this.name = name;
		this.songs = songs 		|| [];
		this.artists = artists 	|| [];
	}

    static fromJSON(obj:any)
    {
        return new Album(obj.name, obj.songs, obj.artists);
    }

    public getName(): string
    {
        return this.name;
    }
/*
	public getArtist(): Artist[]
	{
		return this.artists;
	}

	public setArtist(artists: Artist[])
	{
		this.artists = artists;
	}

	public addArtist(artist: Artist)
	{
		this.artists.push(artist);
	}
*/
    public addSongHash(song: string): boolean
    {
        if(includes(this.songs, song))
        {
            return false;
        }

        this.songs.push(song);
        return true;
    }
}
