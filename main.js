var WebTorrent = require('webtorrent-hybrid')

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
    var buf = new Buffer('Content!');
    buf.name = 'Music.txt';
    client.seed(buf, function(torrent)
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

                var stream = file.createReadStream();
                stream.on('data', function(chunk)
                {
                    console.log('got %d bytes of data', chunk.length);
                    console.log(chunk.toString('utf8'));
                });
            });
        });
    });
}
else
{
    console.error("Unknown command!");
    process.exit(-1);
}
