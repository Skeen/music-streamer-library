var artist = {name: "Tiasu", albums: [{name: 'digital ambitions'}, {name: 'another way to die'}]};
var album = {name: 'digital ambitions', songs: [{name: 'track1'}, {name: 'track2'}]};
var song = {name: 'track1', artists: [{name: 'Tiasu'}, {name: 'Ukendt kunstner'}], album: 'Digital ambitions'};
function sha1(input)
{
  var crypto = require('crypto');
  var shasum = crypto.createHash('sha1');
  shasum.update(input);
  return shasum.digest('hex');
}

var replacer = function(key, value)
{
	if (key == 'albums') {
		var albums = value;
		var sha1Albums = [];
		for(var key in albums){
			var album = albums[key];
			sha1Albums.push(sha1(album.name));
			console.log(album.name);
		}
		console.log(value);
	  return sha1Albums;
	}
	if (key == 'songs') {
		var songs = value;
		var sha1Songs = [];
		for(var key in songs){
			var song = songs[key];
			sha1Songs.push(sha1(song.name));
			console.log(song.name);
		}
		console.log(value);
	  return sha1Songs;
	}
	if (key == 'artists') {
		var artists = value;
		var sha1Artists = [];
		for(var key in artists){
			var artist = artists[key];
			sha1Artists.push(sha1(artist.name));
			console.log(artist.name);
		}
		console.log(value);
	  return sha1Artists;
	}
	if (key == 'album') {
		console.log(value);
		var sha1Album = sha1(value);
	  return sha1Album;
	}
	return value;
}

//console.log(artist);
//console.log(JSON.stringify(artist, replacer));
//console.log(album);
//console.log(JSON.stringify(album, replacer));
console.log(song);
console.log(JSON.stringify(song, replacer));