var buffer = require('buffer');
var includes = require('array-includes');
var ReadableBlobStream = require('readable-blob-stream');

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
	private albumName: string;
	private artistNames: string[];

	// Song belongs to: (hashes)
	private artists: string[];
	private album: string;

	// Finding this song in the net
	private magnet: string;

	// Data and filetype
	private blob: Blob;
	private fileName: string;
	private encoding: string;

    // Alternative to blob
    private stream: any;

	// duration should be in milliseconds.
	constructor(title: string, genre?: string, 
				year?: number, dur?: number,
				albumName?:string, artistNames?: string[],
				artists?: string[], album?: string,
				magnet?: string, blob?: Blob, 
				fileName?: string, encoding?: string)	
	{
        // TODO: Handle undefinedness properly
        if(artists && artistNames && artists.length != artistNames.length)
        {
            throw "Critical error!";
        }

		this.title = title;
		this.genre = genre 				|| null;
		this.year = year 				|| null;
		this.duration = dur				|| null;
		this.artistNames = artistNames 	|| [];
		this.artists = artists 			|| [];
		this.albumName = albumName		|| null;
		this.album = album 	    		|| null;
		this.magnet = magnet			|| null;
		this.blob = blob				|| null;
		this.fileName = fileName		|| null;
		this.encoding = encoding		|| null;
	}

    static fromJSON(obj:any)
    {
        return new Song(obj.title, obj.genre, obj.year, obj.duration,
                        obj.albumName, obj.artistNames,
                        obj.artists, obj.album, obj.magnet, obj.blob,
                        obj.fileName, obj.encoding);
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

    private blobToRenderable()
    {
        var filename: string = this.getFileName();
        var blob: Blob = this.getBlob();
        var stream: string = new ReadableBlobStream(blob);

        var file = {
            name: filename,
            createReadStream: function(opts: any)
            {
                // TODO: Handle opts
                if (!opts) opts = {}
                return stream;
            }
        }
        return file;
    }

	public getAlbumName(): string
	{
		return this.albumName;
	}

	public getArtistNames(): string[]
	{
		return this.artistNames;
	}

	public getFileName() : string
	{
		return this.fileName;
	}

    public setFileName(fileName: string) : void
    {
        this.fileName = fileName;
    }

    public getRenderable() : any
    {
        if(this.hasBlob())
        {
            return this.blobToRenderable();
        }
        else if(this.hasStream())
        {
            return this.stream;
        }
        else
        {
            alert("No renderable source!");
        }
    }

    private hasBlob() : boolean
    {
        return this.blob != undefined;
    }

    private hasStream() : boolean
    {
        return this.stream != undefined;
    }

	public getBlob() : Blob
	{
		return this.blob;
	}

    public setStream(stream:any) : boolean
    {
        if(this.hasBlob())
        {
            return false;
        }
        this.stream = stream;
        return true;
    }

	public setBlob(blob: Blob) : void
	{
		this.blob = blob;
        this.stream = undefined;
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

	public getArtists(): string[]
	{
		return this.artists;
	}
/*
	public setArtist(artists: Artist[])
	{
		this.artists = artists;
	}

	public addArtist(artist: Artist)
	{
		this.artists.push(artist);
	}
*/
	public getAlbum() : string
	{
		return this.album;
	}
/*
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
    private albumNames: string[];

	//constructor(name: string, songs?: Song[], albums?: Album[])
	constructor(name: string, albums?: string[], albumNames?: string[])
	{
		this.name = name;
        // TODO: Handle undefinedness properly
        if(albums && albumNames && albums.length != albumNames.length)
        {
            throw "Critical error!";
        }
		this.albums = albums || [];
		this.albumNames = albumNames || [];
	}

    static fromJSON(obj:any)
    {
        return new Artist(obj.name, obj.albums, obj.albumNames);
    }

    public getName(): string
    {
        return this.name;
    }

    public getAlbums(): string[]
    {
        return this.albums;
    }

    public getAlbumNames(): string[]
    {
        return this.albumNames;
    }

    public addAlbum(hash:string, name:string): boolean
    {
        if(includes(this.albums, hash))
        {
            return false;
        }
        this.albums.push(hash);
        this.albumNames.push(name);
        return true;
    }
}

export class Album
{
	private name: string;

	private songs: string[];
    private songTitles: string[];

	private artists: string[];
    private artistNames: string[];

	constructor(name: string, songs?: string[], artists?: string[],
                songTitles?: string[], artistNames?: string[])
	{
		this.name = name;

        // TODO: Handle undefinedness properly
        if(songs && songTitles && songs.length != songTitles.length)
        {
            throw "Critical error!";
        }
		this.songs = songs 		|| [];
		this.songTitles = songTitles 		|| [];

        // TODO: Handle undefinedness properly
        if(artists && artistNames && artists.length != artistNames.length)
        {
            throw "Critical error!";
        }
		this.artists = artists 	|| [];
        this.artistNames = artistNames || [];
	}

    static fromJSON(obj:any)
    {
        return new Album(obj.name, obj.songs, obj.artists. obj.songTitles, obj.artistNames);
    }

    public getName(): string
    {
        return this.name;
    }

	public getArtists(): string[]
	{
		return this.artists;
	}

    public getArtistNames(): string[]
    {
        return this.artistNames;
    }

	public getSongs(): string[]
	{
		return this.songs;
	}

    public getSongTitles(): string[]
    {
        return this.songTitles;
    }

	public addArtist(hash:string, name:string): boolean
	{
        if(includes(this.artists, hash))
        {
            return false;
        }
        this.artists.push(hash);
        this.artistNames.push(name);
        return true;
	}

    public addSong(hash: string, title:string): boolean
    {
        if(includes(this.songs, hash))
        {
            return false;
        }
        this.songs.push(hash);
        this.songTitles.push(title);
        return true;
    }
}
