var domStorage = require('dom-storage');
var localStorageEmulation = new domStorage('./.db.json', { strict: false, ws: '  ' });
window = {};
window.localStorage = localStorageEmulation;

var depend = require('../../tmp/ts/chord-dht.js').Distributed_HashTable;

describe('nodejs.nopromises', function()
{
    beforeEach(function(done) {
        done();
    });

    describe('Testing: Data API', function()
    {
        describe('Testing: setItem', function()
        {
            it('should save data (error check)', function(done) {
                done();
            });
        });
    });
});
console.log(depend);
var d = new depend();
d.get('abba', true);