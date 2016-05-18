import { HashTable } from "./dht";
import { sha1 } from './sha1';
import { Song, Album, Artist } from './music';

export function createSong(metadata: any, magnetURI: any) : Song
{
    var artist_hashes:string[] = [];
    for(var key in metadata.artist)
    {
        var artist = metadata.artist[key];
        artist_hashes.push(sha1(artist));
    }
    return new Song(metadata.title, JSON.stringify(metadata.genre), metadata.year, metadata.duration, metadata.album, metadata.artist, artist_hashes, sha1(metadata.album), magnetURI);
}
