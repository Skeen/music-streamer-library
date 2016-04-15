var WebTorrent = require('webtorrent-hybrid')
var clc = require('cli-color');
var fs = require('fs')

var client = new WebTorrent()

client.on('error', function (err:any) {
    console.error('ERROR: ' + err.message);
    process.exit(1);
});

var path = process.argv[2];
console.log("Serving files from: " + path + "\n");

var file_log = function(file:string, msg:string)
{
    console.log('[' + clc.cyan(file) + ']: ' + msg);
}

fs.readdir(path, function(err:any, files:any)
{
    if(err)
    {
        console.error('FILE ERROR: ' + err.message);
        process.exit(1);
    }
    for (var i in files)
    {
        var file = files[i];
        console.log(clc.red("*") + " " + clc.cyan(file));
    }
    console.log();
    console.log("Log:");
    console.log("--------------------------------------------------------------------------------");

    for (var i in files)
    {
        var file = files[i];
        (function(file:any)
         {
             client.seed(file, function(torrent:any)
             {
                 torrent.on('wire', function (wire:any, addr:any)
                 {
                     file_log(file, "Connected to peer with address '" + clc.magenta(addr) + "'")
                 });

                 file_log(file, "Seeding!");
                 file_log(file, "MagnetURI: '" + clc.green(torrent.magnetURI) + "'");
             });
         })(path + file);
    }
});


