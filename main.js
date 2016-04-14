var WebTorrent = require('webtorrent')

var client = new WebTorrent()

if(process.argv.length < 3)
{
    console.error("Missing argument!");
    process.exit(-1);
}

var command = process.argv[2];
console.log("got cmd: " + command);

if(command == "create_content")
{
    var createTorrent = require('create-torrent');
    createTorrent('src/', function(err, torrent)
    {
        if(err)
        {
            console.error(err);
            process.exit(-1);
        }
        var bencode = require('bencode')
        var result = bencode.decode(torrent, 'utf8')
        console.log(JSON.stringify(result, null, 4));
    });
}
else if(command == "seed")
{
    client.seed("res/Pixelland.mp3", {
        announce: ["http://0.0.0.0:8000/announce"]
    },
    function(torrent)
    {
        torrent.on('wire', function (wire, addr)
        {
            console.log('connected to peer with address ' + addr)
        });

        console.log('Client is seeding: ', torrent.infoHash);
        console.log("MagnetURI: " + torrent.magnetURI);
    });
}

else if(command == "seed-buffer")
{
    var buf = new Buffer('Content here!');
    buf.name = 'Transfer name here!';
    client.seed(buf, {
        announce: ["http://0.0.0.0:8000/announce"]
    },
    function(torrent)
    {
        torrent.on('wire', function (wire, addr)
        {
            console.log('connected to peer with address ' + addr)
        });

        console.log('Client is seeding: ', torrent.infoHash);
        console.log("MagnetURI: " + torrent.magnetURI);
    });
}
else if(command == "leech")
{
    var magnetURI = process.argv[3];
    console.log("MagnetURI: " + magnetURI);

    client.download(magnetURI, function(torrent)
    {
        console.log('Client is downloading:', torrent.infoHash);
        torrent.on('download', function(chunkSize)
        {
            console.log('chunk size: ' + chunkSize);
            console.log('total downloaded: ' + torrent.downloaded);
            console.log('download speed: ' + torrent.downloadSpeed);
            console.log('progress: ' + torrent.progress);
            console.log('======');
        });
        torrent.on('wire', function (wire, addr)
        {
            console.log('connected to peer with address ' + addr)
        });
        torrent.on('done', function()
        {
            console.log('torrent finished downloading');
            torrent.files.forEach(function(file)
            {
                // File is the FileAPI
                //console.log(file);

                /*
                var stream = file.createReadStream();
                stream.on('data', function(chunk)
                {
                    console.log('got %d bytes of data', chunk.length);
                    console.log(chunk.toString('utf8'));
                });
                */
                file.getBuffer(function(err, buffer) 
                {
                    if (err)
                    {
                        console.error(err);
                        process.exit(-1);
                    }
                    console.log("Downloaded " + file.name);

                    var fs = require('fs');
                    // TODO: Ensure that tmp exists
                    var filepath = "tmp/" + file.name;
                    fs.writeFile(filepath, buffer, function(err)
                    {
                        if (err)
                        {
                            console.error(err);
                            process.exit(-1);
                        }
                   
                        var Player = require('player');
                        var player = new Player(filepath);
                        player.play(function(err, player)
                        {
                            if (err)
                            {
                                console.error(err);
                                process.exit(-1);
                            }

                            console.log('playend!');
                        });
                    });
                });
                //console.log(buffer)
            })
        });
    });
}
else
{
    console.error("Unknown command!");
    process.exit(-1);
}
