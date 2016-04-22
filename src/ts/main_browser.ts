var WebTorrent = require('webtorrent')
var dragDrop = require('drag-drop')
var mm = require('musicmetadata')

var client = new WebTorrent()

import { HashTable, HTTP_HashTable } from "./dht";
import { sha1 } from './sha1';
import { addSong } from './dht_overlay';
import { Song, Album, Artist } from './music';

// TODO: Replace by 'new Distributed_HashTable();'
var hash_table:HashTable = new HTTP_HashTable();

client.on('error', function (err:any) {
    console.error('ERROR: ' + err.message)
})

function print_torrent(torrent:any)
{
    log('<b>' + torrent.name + '</b>' +
            '<ul>' +
            '<li> hash: ' + torrent.infoHash + '</li> ' +
            '<li> <a href="' + torrent.magnetURI + '" target="_blank">[Magnet URI]</a></li>' +
            '<li> <a href="' + torrent.torrentFileBlobURL + '" target="_blank" download="' + torrent.name + '.torrent">[Download .torrent]</a></li>' +
            '</ul>'
       );
}

function onTorrent (torrent:any) {
    log('Got torrent metadata!');
    print_torrent(torrent);

    // Print out progress every 5 seconds
    var interval = setInterval(function () {
        log('Progress: ' + (torrent.progress * 100).toFixed(1) + '%');
    	}, 5000)

    torrent.on('done', function () {
        log('Progress: 100%');
        clearInterval(interval);
    })

    // Render all files into to the page
    torrent.files.forEach(function (file:any) {
        file.renderTo('media_player');
        log('(Blob URLs only work if the file is loaded from a server. "http//localhost" works.'
			+ '"file://" does not.)');
        file.getBlobURL(function (err:any, url:any)
        {
            if (err)
            {
                return log(err.message);
            }
            log('File done.');
            log('<a href="' + url + '">Download full file: ' + file.name + '</a>');
        });

        var parser = mm(file.createReadStream(), {assumeStream: true}, function(err:any, metadata:any)
        {
            if (err) throw err;
            log(JSON.stringify(metadata, null, 4));
        });
    })
}

// Event to download torrent when user clicks button, use text input field.
document.querySelector('#magnet').addEventListener('submit', function (e) {
    e.preventDefault() // Prevent page refresh

	// Get torrent magnet from text input field.
    var element:any = document.querySelector('#magnet input[name=torrentId]');
    var torrentId = element.value

    download_torrent(torrentId);
});

var dht_lookup = function(hash:string)
{
    log("Looking up in DHT: " + hash);

    hash_table.get_raw(hash, function(err, value)
    {
        if(err)
        {
            log("Unable to query overlay network: " + err.message);
            return;
        }
        handle_lookup(value);
    });
}
// TODO: Fix compilation error
window['dht_lookup'] = dht_lookup;

var download_torrent = function(magnetURI:string)
{
    log('Adding ' + magnetURI);
	// Callback when torrentId metadata has been retrieved,
	// 	and torrent is ready to be downloaded
    client.add(magnetURI, onTorrent);
}
// TODO: Fix compilation error
window['download_torrent'] = download_torrent;

function handle_lookup(value:any)
{
    //log("Found value: " + value);
    //console.log(JSON.stringify(JSON.parse(value), null, 4));
    var object = JSON.parse(value);
    //{"type":"artist","payload":{"name":"Popskyy","albums":["c8efcee66e9da8210a47f1fb68ee807ed6579cc2"]}}
    if(object.type == "artist")
    {
        var artist:Artist = Artist.fromJSON(object.payload);

        var output = "Found artist: " + artist.getName() + "<br>";
        output += "Albums: <br>";
        var list = '<ul>';
        artist.getAlbums().forEach(function(album:string)
        {
            list += '<li>';
            list += '<a onclick="dht_lookup(' + "'" + album + "'" + ');" href="javascript:void(0);">' + album + '</a>';
            list += '</li>';
        });
        list += '</ul>';

        output += list;
        log(output);
    }
    else if(object.type == "album")
    {
        var album:Album = Album.fromJSON(object.payload);

        var output = "Found album: " + album.getName() + "<br>";
        output += "Artists: <br>";
        var list = '<ul>';
        album.getArtists().forEach(function(artist:string)
        {
            list += '<li>';
            list += '<a onclick="dht_lookup(' + "'" + artist + "'" + ');" href="javascript:void(0);">' + artist + '</a>';
            list += '</li>';
        });
        list += '</ul>';
        output += list;

        output += "Songs: <br>";
        var list = '<ul>';
        album.getSongs().forEach(function(song:string)
        {
            list += '<li>';
            list += '<a onclick="dht_lookup(' + "'" + song + "'" + ');" href="javascript:void(0);">' + song + '</a>';
            list += '</li>';
        });
        list += '</ul>';
        output += list;

        log(output);
    }
    else if(object.type == "song")
    {
        var song:Song = Song.fromJSON(object.payload);

        var output = "Found song: " + song.getTitle() + " ";
        output += '<a onclick="download_torrent(' + "'" + song.getMagnet() + "'" + ');" href="javascript:void(0);">' + "Play Now" + '</a><br>';

        output += "Genre: " + song.getGenre() + "<br>";
        output += "Year: " + song.getYear() + "<br>";
        output += "Duration: " + song.getDuration() + "<br>";

        output += "Artists: <br>";
        var list = '<ul>';
        song.getArtists().forEach(function(artist:string)
        {
            list += '<li>';
            list += '<a onclick="dht_lookup(' + "'" + artist + "'" + ');" href="javascript:void(0);">' + artist + '</a>';
            list += '</li>';
        });
        list += '</ul>';
        output += list;

        output += "Album: " + '<a onclick="dht_lookup(' + "'" + song.getAlbum() + "'" + ');" href="javascript:void(0);">' + song.getAlbum() + '</a><br>';
        output += "MagnetURI: " + '<a href="' + song.getMagnet() + '" target="_blank">[Magnet URI]</a>';

        log(output);
    }
}

// Event to search for a file in the CMS, using input from text input field.
document.querySelector('#search').addEventListener('submit', function (e) {
    e.preventDefault() // Prevent page refresh

    var element:any = document.querySelector('#search input[name=search_string]');
    var search_string = element.value
    log('Searching for ' + search_string);

    hash_table.get(search_string, function(err, value)
    {
        if(err)
        {
            log("Unable to query overlay network: " + err.message);
            return;
        }

        handle_lookup(value);
    });
});

// When user drops files on the browser, create a new torrent and start seeding it!
dragDrop('#droparea', function (files:any) {
    log('User dropped file(s):');
    var list = '<ul>';
    files.forEach(function (file:any)
    {
        list += '<li>';
        list += file.name;
        list += '</li>';
    });
    list += '</ul>';
    log(list);

    log("Starting to seed them!");
    files.forEach(function (file:any)
    {
        client.seed(file, function (torrent:any)
        {
            var parser = mm(file, function(err:any, metadata:any)
            {
                if (err) throw err;
                log(JSON.stringify(metadata, null, 4));

                addSong(metadata, torrent.magnetURI, hash_table, log);
            });

            print_torrent(torrent);
        });
    });
})

function log (str:any) {
    var p = document.createElement('p')
        p.innerHTML = str
        document.querySelector('.log').appendChild(p)
}

//log("A");

