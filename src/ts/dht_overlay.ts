import { HashTable } from "./dht";
import { sha1 } from './sha1';
import { Song, Album, Artist } from './music';
/*
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
*/

export function addSong(metadata : any, magnetURI : string, hash_table : HashTable, log:any)
{
    // TODO: Test if song is in DHT
    var artist_hashes:string[] = [];
    for(var key in metadata.artist)
    {
        var artist = metadata.artist[key];
        artist_hashes.push(sha1(artist));
    }
    var song = new Song(metadata.title, JSON.stringify(metadata.genre), metadata.year, metadata.duration, artist_hashes, sha1(metadata.album), magnetURI);

    hash_table.put(song.getTitle(), JSON.stringify({type: "song", payload: song}), function(err, value)
    {
        if(err)
        {
            log("Unable to store in overlay network: " + err.message);
            return;
        }
        log("Stored in overlay network: " + value);
    });

    // Album
    hash_table.get(metadata.album, function(err, value)
    {
        var album_artist_hashes:string[] = [];
        for(var key in metadata.albumartist)
        {
            var artist = metadata.albumartist[key];
            album_artist_hashes.push(sha1(artist));
        }

        var album:Album;
        if(err) // This album is not in DHT
        {
            log("No album found in DHT, creating one!");
            album = new Album(metadata.album, [sha1(metadata.title)], album_artist_hashes);
        }
        else // This album is in DHT
        {
            log("Album found in DHT, adding song to it!");
            album = Album.fromJSON(JSON.parse(value).payload);
            var added:boolean = album.addSongHash(sha1(metadata.title));
            if(added == false)
                return;
            //console.log(JSON.stringify(album, null, 4));
        }

        hash_table.put(album.getName(), JSON.stringify({type: "album", payload: album}), function(err, value)
        {
            if(err)
            {
                log("Unable to store in overlay network: " + err.message);
                return;
            }
            log("Stored in overlay network: " + value);
        });
    });

    // Artists
    for(var key in metadata.artist)
    {
        (function(artist_name:string)
         {
            hash_table.get(artist_name, function(err, value)
            {
                var artist:Artist;
                if(err) // This artist is not in DHT
                {
                    log("No artist found in DHT, creating one!");
                    artist = new Artist(artist_name, [sha1(metadata.album)]);
                }
                else // This artist is in DHT
                {
                    log("Artist found in DHT, album song to it!");
                    artist = Artist.fromJSON(JSON.parse(value).payload);
                    var added:boolean = artist.addAlbumHash(sha1(metadata.album));
                    if(added == false)
                        return;
                    //console.log(JSON.stringify(artist, null, 4));
                }

                // Push to DHT
                hash_table.put(artist.getName(), JSON.stringify({type: "artist", payload: artist}), function(err, value)
                {
                    if(err)
                    {
                        log("Unable to store in overlay network: " + err.message);
                        return;
                    }
                    log("Stored in overlay network: " + value);
                });
            });
         })(metadata.artist[key]);
    }
}
