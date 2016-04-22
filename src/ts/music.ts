var buffer = require('buffer');

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

	// Song belongs to:
	private artists: Artist[];
	private album: Album;

	// Finding this song in the net
	private magnet: string;
	private buffer: Buffer;
	
	// duration should be in milliseconds.
	constructor(title: string, genre?: string, 
				year?: number, dur?: number,
				artists?: Artist[], album?: Album,
				magnet?: string)
	{
		this.title = title;
		this.genre = genre 		|| null;
		this.year = year 		|| null;
		this.duration = dur		|| null;
		this.artists = artists 	|| [];
		this.album = album 	    || null;
		this.magnet = magnet	|| null;
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
	private albums: Album[];

	//constructor(name: string, songs?: Song[], albums?: Album[])
	constructor(name: string, albums?: Album[])
	{
		this.name = name;
		//this.songs = songs 	|| [];
		this.albums = albums|| [];
	}

    public getName(): string
    {
        return this.name;
    }
}

export class Album
{
	private name: string;
	private songs: Song[];
	private artists: Artist[];

	constructor(name: string, songs?: Song[], artists?: Artist[])
	{
		this.name = name;
		this.songs = songs 		|| [];
		this.artists = artists 	|| [];
	}

    public getName(): string
    {
        return this.name;
    }

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

    public addSong(song: Song)
    {
        this.songs.push(song);
    }
}
