import { HashTable } from "./dht";
import { sha1 } from './sha1';
import { Song, Album, Artist } from './music';

var replacer = function(key:string, value:any)
{
    // An artist has multiple albums
	if (key == 'albums') {
		var albums = value;
		var sha1Albums:any = [];
		for(var key in albums){
			var album = albums[key];
			sha1Albums.push(sha1(album.name));
			console.log(album.name);
		}
		console.log(value);
	  return sha1Albums;
	}
    // An album has multiple songs
    else if (key == 'songs') {
		var songs = value;
		var sha1Songs:any = [];
		for(var key in songs){
			var song = songs[key];
			sha1Songs.push(sha1(song.title));
			console.log(song.name);
		}
		console.log(value);
	  return sha1Songs;
	}
    // Song and Album has multiple artists
    else if (key == 'artists') {
		var artists = value;
		var sha1Artists:any = [];
		for(var key in artists){
			var artist = artists[key];
			sha1Artists.push(sha1(artist.name));
			console.log(artist.name);
		}
		console.log(value);
	  return sha1Artists;
	}
    // Song has an album
    else if (key == 'album') {
		console.log(value);
		var sha1Album = sha1(value);
	  return sha1Album;
	}
	return value;
}

export function addSong(metadata : any, magnetURI : string, hash_table : HashTable, log:any)
{
    // We'll add album and artist later
    var song = new Song(metadata.title, JSON.stringify(metadata.genre), metadata.year, metadata.duration, null, null, magnetURI);

    // We'll add artist later
    var album = new Album(metadata.album, [song], null);

    var artists:Artist[] = [];
    for(var key in metadata.artist)
    {
        var meta_artist = metadata.artist[key];
        var artist = new Artist(meta_artist, [album]);
        artists.push(artist);
    }

    // Setup references
    album.setArtist(artists);
    song.setArtist(artists);
    song.setAlbum(album);

    hash_table.put(artist.getName(), JSON.stringify({type: "artist", payload: artist}, replacer), function(err, value)
    {
        if(err)
        {
            log("Unable to store in overlay network: " + err.message);
            return;
        }
        log("Stored in overlay network: " + value);
    });

    hash_table.put(album.getName(), JSON.stringify({type: "album", payload: album}, replacer), function(err, value)
    {
        if(err)
        {
            log("Unable to store in overlay network: " + err.message);
            return;
        }
        log("Stored in overlay network: " + value);
    });

    hash_table.put(song.getTitle(), JSON.stringify({type: "song", payload: song}, replacer), function(err, value)
    {
        if(err)
        {
            log("Unable to store in overlay network: " + err.message);
            return;
        }
        log("Stored in overlay network: " + value);
    });
}
