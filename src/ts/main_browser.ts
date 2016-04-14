declare var require: any

var WebTorrent = require('webtorrent')

var client = new WebTorrent()

client.on('error', function (err:any) {
    console.error('ERROR: ' + err.message)
})

function onTorrent (torrent:any) {
    log('Got torrent metadata!')
        log(
                'Torrent info hash: ' + torrent.infoHash + ' ' +
                '<a href="' + torrent.magnetURI + '" target="_blank">[Magnet URI]</a> ' +
                '<a href="' + torrent.torrentFileBlobURL + '" target="_blank" download="' + torrent.name + '.torrent">[Download .torrent]</a>'
           )

        // Print out progress every 5 seconds
        var interval = setInterval(function () {
            log('Progress: ' + (torrent.progress * 100).toFixed(1) + '%')
        }, 5000)

    torrent.on('done', function () {
        log('Progress: 100%')
            clearInterval(interval)
    })

    // Render all files into to the page
    torrent.files.forEach(function (file:any) {
        file.appendTo('.log')
            log('(Blob URLs only work if the file is loaded from a server. "http//localhost" works. "file://" does not.)')
            file.getBlobURL(function (err:any, url:any) {
                if (err) return log(err.message)
                    log('File done.')
                        log('<a href="' + url + '">Download full file: ' + file.name + '</a>')
            })
    })
}

document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault() // Prevent page refresh

    var element:any = document.querySelector('form input[name=torrentId]');
    var torrentId = element.value
    log('Adding ' + torrentId)
    client.add(torrentId, onTorrent)
})

function log (str:any) {
    var p = document.createElement('p')
        p.innerHTML = str
        document.querySelector('.log').appendChild(p)
}

log("A");
