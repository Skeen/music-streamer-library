var Client = require('bittorrent-tracker')
var magnet = require('magnet-uri')
export class Scraper{
  public static scrape(magnetURI: any, callback: any) {
      var parsed = magnet(magnetURI);

      var requiredOpts = {
      infoHash: parsed.infoHashBuffer,
      peerId: new Buffer('01234567890123456789'),
      announce: parsed.tr
      }

      var client = new Client(requiredOpts);

      client.scrape();

      var first = true;
      client.on('scrape', function(data:any)
      {
        if(first)
        {
            callback(data);
            first = false;  
        }
      });
  }
}