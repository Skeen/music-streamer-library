var dragDrop = require('drag-drop')
var mm = require('musicmetadata')
var render = require('render-media')
var toBuffer = require('blob-to-buffer')
require('string.prototype.startswith');


import { HashTable, HTTP_HashTable } from "./dht";
import { sha1 } from './sha1';
import { createSong, addSong } from './dht_overlay';
import { bufferToRenderable, Song, Album, Artist } from './music';
import { Storage } from './storage';
import { TorrentClient } from './torrent';

// TODO: Replace by 'new Distributed_HashTable();'
var hash_table:HashTable = new HTTP_HashTable();
var badHealthList: string[] = [];
var browser_start = function() {

    function print_torrent(torrent: any, query?: string) {
	torrent_to_html(torrent.name, torrent.infoHash, torrent.magnetURI, torrent.torrentFileBlobURL, query);
}

function torrent_to_html(name:string, info:string, magnet:string, blobURL:string, query?:string)
{
	log('<b>' + name + '</b>' +
            '<ul>' +
            '<li> hash: ' + info + '</li> ' +
            '<li> <a href="' + magnet + '" target="_blank">[Magnet URI]</a></li>' +
            '<li> <a href="' + blobURL + '" target="_blank" download="' + name + '.torrent">[Download .torrent]</a></li>' +
            '</ul>'
            , query);
    }

    function handleMusicStream(file: any, magnetURI: string) {
        var stream = file.createReadStream();

        render.render(file, '.media_player',
            function(err: any, elem: any) {
                if (err) throw err;
                console.log(elem);
            });

        //file.appendTo('player');
        log('(Blob URLs only work if the file is loaded from a server.'
            + '"http//localhost" works.'
            + '"file://" does not.)');
        file.getBlobURL(
            function(err: any, url: any) {
                if (err) {
                    return log(err.message);
                }
                log('File done.');
                log('<a href="' + url
                    + '">Download full file: '
                    + file.name + '</a>');

            });

        var parser = mm(stream, { assumeStream: true },
            function(err: any, metadata: any) {
                if (err) throw err;
                log(JSON.stringify(metadata, null, 4));

                file.getBuffer(function(err: any, buffer: any) {
                    if (err) throw err;

                    function toArrayBuffer(buffer: any) {
                        var ab = new ArrayBuffer(buffer.length);
                        var view = new Uint8Array(ab);
                        for (var i = 0; i < buffer.length; ++i) {
                            view[i] = buffer[i];
                        }
                        return ab;
                    }

                    var song: Song = createSong(metadata, magnetURI);
                    song.setFileName(file.name);
                    song.setBlob(new Blob([toArrayBuffer(buffer)]));

                    Storage.addSong(song, function(err: any, sha1: string) {
                        if (err) throw err;
                        log('Added song to storage!');
                        // TODO: Handle this event
                    });
                });
            });
    }

    // Event to download torrent when user clicks button, use text input field.
    document.querySelector('#magnet').addEventListener('submit', function(e) {
        e.preventDefault() // Prevent page refresh

        // Get torrent magnet from text input field.
        var element: any = document.querySelector('#magnet input[name=torrentId]');
        var torrentId = element.value

    TorrentClient.download_song(torrentId, handleMusicStream,
								log,null,torrent_to_html);
    });

    var dht_lookup = function(hash: string) {
        log("Looking up in DHT: " + hash);

        hash_table.get_raw(hash, function(err, value) {
            if (err) {
                log("Unable to query overlay network: " + err.message);
                return;
            }
            handle_lookup(value);
        });
    }

    var browser_window: any = window;
    browser_window['dht_lookup'] = dht_lookup;

    var download_torrent = function(magnetURI: string) {
        log('Adding ' + magnetURI);
        // Callback when torrentId metadata has been retrieved,
        // 	and torrent is ready to be downloaded
	TorrentClient.download_song(magnetURI, handleMusicStream,
							   log,null,torrent_to_html);
    }
    browser_window['download_torrent'] = download_torrent;

    var play_song = function(lookup_key: string) {
        log('Playing: ' + lookup_key);

        Storage.getSong(lookup_key, function(err: any, song: Song) {
            if (err) throw err;

            var file = bufferToRenderable(song);

            render.render(file, '.media_player',
                function(err: any, elem: any) {
                    if (err) throw err;
                    console.log(elem);
                });
        });
    }
    browser_window['play_song'] = play_song;

    function handle_lookup(value: any) {
        //log("Found value: " + value);
        //console.log(JSON.stringify(JSON.parse(value), null, 4));
        var object = JSON.parse(value);
        //{"type":"artist","payload":{"name":"Popskyy","albums":["c8efcee66e9da8210a47f1fb68ee807ed6579cc2"]}}
        if (object.type == "artist") {
            var artist: Artist = Artist.fromJSON(object.payload);

            var output = "Found artist: " + artist.getName() + "<br>";
            output += "Albums: <br>";
            var list = '<ul>';
            artist.getAlbums().forEach(function(album: string) {
                list += '<li>';
                list += '<a onclick="dht_lookup(' + "'" + album + "'" + ');" href="javascript:void(0);">' + album + '</a>';
                list += '</li>';
            });
            list += '</ul>';

            output += list;
            log(output);
        }
        else if (object.type == "album") {
            var album: Album = Album.fromJSON(object.payload);

            var output = "Found album: " + album.getName() + "<br>";
            output += "Artists: <br>";
            var list = '<ul>';
            album.getArtists().forEach(function(artist: string) {
                list += '<li>';
                list += '<a onclick="dht_lookup(' + "'" + artist + "'" + ');" href="javascript:void(0);">' + artist + '</a>';
                list += '</li>';
            });
            list += '</ul>';
            output += list;

            output += "Songs: <br>";
            var list = '<ul>';
            album.getSongs().forEach(function(song: string) {
                list += '<li>';
                list += '<a onclick="dht_lookup(' + "'" + song + "'" + ');" href="javascript:void(0);">' + song + '</a>';
                list += '</li>';
            });
            list += '</ul>';
            output += list;

            log(output);
        }
        else if (object.type == "song") {
            var song: Song = Song.fromJSON(object.payload);

            song_printer(song);
        }
    }

    // Event to search for a file in the CMS, using input from text input field.
    document.querySelector('#search').addEventListener('submit', function(e) {
        e.preventDefault() // Prevent page refresh

        var element: any = document.querySelector('#search input[name=search_string]');
        var search_string = element.value
        log('Searching for ' + search_string);

        hash_table.get(search_string, function(err, value) {
            if (err) {
                log("Unable to query overlay network: " + err.message);
                return;
            }

            handle_lookup(value);
        });
    });

    // Avoid lookup_key
    function song_printer(song: Song, lookup_key?: string, query?: string) {
        var output = "<b>" + song.getTitle() + "</b> - ";

        if (lookup_key) {
            output += '<a onclick="play_song(' + "'" + lookup_key + "'" + ');" href="javascript:void(0);">' + "Play Now" + '</a><br>';
        }
        else {
            output += '<a onclick="download_torrent(' + "'" + song.getMagnet() + "'" + ');" href="javascript:void(0);">' + "Play Now" + '</a><br>';
        }

        output += '<ul>';
        output += '<li>';
        output += "Genre: " + song.getGenre() + "<br>";
        output += '</li>';

        output += '<li>';
        output += "Year: " + song.getYear() + "<br>";
        output += '</li>';

        output += '<li>';
        output += "Duration: " + song.getDuration() + "<br>";
        output += '</li>';

        output += '<li>';
        output += "Artists: <br>";
        var list = '<ul>';
        song.getArtists().forEach(function(artist: string) {
            list += '<li>';
            list += '<a onclick="dht_lookup(' + "'" + artist + "'" + ');" href="javascript:void(0);">' + artist + '</a>';
            list += '</li>';
        });
        list += '</ul>';
        output += list;
        output += '</li>';

        output += '<li>';
        output += "Album: " + '<a onclick="dht_lookup(' + "'" + song.getAlbum() + "'" + ');" href="javascript:void(0);">' + song.getAlbum() + '</a><br>';
        output += '</li>';
        output += '<li>';
        output += "MagnetURI: " + '<a href="' + song.getMagnet() + '" target="_blank">[Magnet URI]</a>';
        output += '</li>';

        log(output, query);
    }

    // TODO: Use iterate instead
    Storage.getKeys(function(err: any, keys: string[]) {
        if (err) throw err;

        console.log(keys);

        for (var key in keys) {
            var lookup_key = keys[key];
            (function(lookup_key: string) {
                Storage.getSong(lookup_key, function(err: any, song: Song) {
                    if (err) throw err;

                    var blob: Blob = song.getBlob();
                    console.log(blob);

				TorrentClient.seed_torrent(blob, log, null, song_printer(song, lookup_key, ".local"));        
            });
            })(lookup_key);
        }
    });

    // When user drops files on the browser, create a new torrent and start seeding it!
    dragDrop('#droparea', function(files: any) {
        log('User dropped file(s):');
        var list = '<ul>';
        files.forEach(function(file: any) {
            list += '<li>';
            list += file.name;
            list += '</li>';
        });
        list += '</ul>';
        log(list);

        log("Starting to seed them!");
        files.forEach(function(file: any) {
            TorrentClient.seed_torrent(file, log, null, function(torrent: any) {
                badHealthList.push(torrent.magnetURI);
                hash_table.get("badHealth", function(error?: any, value?: string) {
                    if (error) {
                        throw error;
                    }
                    else {
                        //TODO replace any with type info.
                        var badHealth: any = JSON.parse(value);
                        for (var i = 0; i < badHealth.length; i++) {
                            if (badHealthList.indexOf(badHealth[i]) === -1) {
                                badHealthList.push(badHealth[i]);
                            }
                        }
                        var jsonList = JSON.stringify(badHealthList);
                        hash_table.put("badHealth", jsonList, function() {
                            log('Updated bad health list');
                        });
                    }
                });
                var parser = mm(file, function(err: any, metadata: any) {
                    if (err) throw err;
                    //log(JSON.stringify(metadata, null, 4));

                    addSong(metadata, torrent.magnetURI, hash_table, log);

                    //console.log(file);
                    //console.log(torrent.magnetURI);

                    var song: Song = createSong(metadata, torrent.magnetURI);
                    song.setFileName(file.name);
                    song.setBlob(file);

                    Storage.addSong(song, function(err: any, sha1: string) {
                        if (err) throw err;

                        log('Added song to storage!');

                        // TODO: Handle this event
                    });
                });

                print_torrent(torrent);
            });
        });
    });
    hash_table.get("badHealth", function(error?: any, value?: string) {
        if (error) {
            var jsonList : string = JSON.stringify([]);
            hash_table.put("badHealth", jsonList, function() {
                log('Updated bad health list');
            });
        }
        else {
            //TODO replace any with type info.
            var badHealth: any = JSON.parse(value);
            var seedList = badHealth.length < 5 ? badHealth : getRandom(badHealth, 5);
            for (var i = 0; i < seedList.length; i ++)
            {
                download_torrent(seedList[i]);
            }
        }
    });
    function getRandom(arr: any, n: any) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len;
    }
    return result;
    }
    function log(str: any, query?: string) {
        var p = document.createElement('p');
        p.innerHTML = str;
        if (query) {
            document.querySelector(query).appendChild(p);
        }
        else {
            document.querySelector('.log').appendChild(p);
        }
    }

    //log("A");
}
var browser_window: any = window;
browser_window['browser_start'] = browser_start;