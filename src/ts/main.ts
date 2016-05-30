var WebTorrent = require('webtorrent-hybrid');
var clc = require('cli-color');
var fs = require('fs');

var client = new WebTorrent()

client.on('error', function (err:any) {
    console.error('ERROR: ' + err.message);
    process.exit(1);
});

var hash = process.argv[2];
console.log("Downloading: " + hash);

client.add(hash, function(torrent:any)
{
    torrent.files.forEach(function(file:any)
    {
        file.getBuffer(function(err:any, buffer:any)
        {
        });
    });

    torrent.on('done', function(){
        console.log("DOWNLOADED EVERYTHING, REBOOTING!");
        client.destroy();
        process.exit(-1);
    });
});

