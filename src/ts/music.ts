class Song
{
	private title: string;
	private genre: string;
	private year: number;
	private duration: number;

	private artists: Artist[];
	private albums: Album[];
	
	// duration should be in milliseconds.
	constructor(title: string, genre?: string, 
				year?: number, dur?: number,
				artists?: Artist[], albums?: Album[])
	{
		this.title = title;
		this.genre = genre 		|| "unknown";
		this.year = year 		|| -1;
		this.duration = dur		|| -1;
		this.artists = artists 	|| [];
		this.albums = albums 	|| [];
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

	public getAlbums() : Album[]
	{
		return this.albums;
	}

	public setAlbum(albums: Album[])
	{
		this.albums = albums;
	}

	public addAlbum(album: Album)
	{
		this.albums.push(album);
	}
}

class Artist
{
	private name: string;
	private songs: Song[];
	private albums: Album[];

	constructor(name: string, songs?: Song[], albums?: Album[])
	{
		this.name = name;
		this.songs = songs || [];
		this.albums = albums || [];
	}
}

class Album
{
	private name: string;
	private songs: Song[];
	private artists: Artist[];

	constructor(name: string, songs?: Song[], artists?: Artist[])
	{
		this.name = name;
		this.songs = songs || [];
		this.artists = artists || [];
	}
}
