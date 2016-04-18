var WebTorrent = require('webtorrent')
var dragDrop = require('drag-drop')
var mm = require('musicmetadata')

var client = new WebTorrent()

import { HashTable, HTTP_HashTable } from "./dht";

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
        file.appendTo('.log');
        log('(Blob URLs only work if the file is loaded from a server. "http//localhost" works. "file://" does not.)');
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

        /* // Works, but wraps stream with another stream
        var Stream = require('stream');
         
        var src = new Stream();
        src.readable = true;
        var parser = mm(src, function(err:any, metadata:any)
        {
            if (err) throw err;
            log(JSON.stringify(metadata, null, 4));
        });

        var readable = file.createReadStream();
        readable.on('data', (chunk:any) => {
            src.emit('data', chunk);
            console.log('got %d bytes of data', chunk.length);
        });
        */

        /* // Works, but emitting only when entire file is downloaded
        file.getBuffer(function (err:any, buffer:any) {
            if (err) throw err;
            var blob = new Blob([ buffer ], { type: 'application/octet-binary' });
            var parser = mm(blob, function(err:any, metadata:any)
            {
                if (err) throw err;
                log(JSON.stringify(metadata, null, 4));
            });
        });
        */
    })
}

document.querySelector('#magnet').addEventListener('submit', function (e) {
    e.preventDefault() // Prevent page refresh

    var element:any = document.querySelector('#magnet input[name=torrentId]');
    var torrentId = element.value
    log('Adding ' + torrentId)
    client.add(torrentId, onTorrent)
});

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
        log("Found value: " + value);
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
            print_torrent(torrent);
            hash_table.put(file.name, torrent.magnetURI, function(err, value)
            {
                if(err)
                {
                    log("Unable to store in overlay network: " + err.message);
                    return;
                }
                log("Stored in overlay network: " + value);
            });
        });
        var parser = mm(file, function(err:any, metadata:any)
                {
                    if (err) throw err;
                    log(JSON.stringify(metadata, null, 4));
                });
    });
})


function log (str:any) {
    var p = document.createElement('p')
        p.innerHTML = str
        document.querySelector('.log').appendChild(p)
}

//log("A");

