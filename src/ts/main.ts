var WebTorrent = require('webtorrent')

var client = new WebTorrent()

client.on('error', function (err:any) {
    console.error('ERROR: ' + err.message)
})
