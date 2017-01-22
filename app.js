// rivendellscrobbler
// app.js

var LastfmAPI = require('lastfmapi');
var passwords = require('./passwords.json');

var lfm = new LastfmAPI({
    'api_key' : passwords.lastfm_api_key,
    'secret' : passwords.lastfm_secret
});

var scrobbleHistoryLocation = "./scrobbles.txt";

function authenticateSession(callback) {
	lfm.auth.getMobileSession(passwords.lastfm_user, passwords.lastfm_password, function(err, session) {
		lfm.setSessionCredentials(session.username, session.key);
		callback();
	});
}

function scrobble(artist, track, timestamp) {
	lfm.track.scrobble({
	    'artist' : artist,
	    'track' : track,
	    'timestamp' : timestamp
	}, function (err, scrobbles) {
	    if (err) { return console.log('Failed to scrobble!', artist, track, ":", err); }
	    console.log('Scrobbled:', scrobbles);
	});
}

function readLines(filePath, callback) {
	var lineReader = require('readline').createInterface({
	  input: require('fs').createReadStream(filePath)
	});

	lineReader.on('line', function (line) {
	  callback(line);
	});
}

var lastTimestamp = null;
function loadSongHistory(filePath, newSongCallback) {
	readLines(filePath, function(line) {
		var pattern = /([^\n]*)---([^\n]*)---([^\n]*)/g;
		var match = pattern.exec(line);
		if (match) {
			var artist = match[1];
			if (artist) {
				artist = artist.trim();
			}
			var track = match[2];
			if (track) {
				track = track.trim();
			}
			var timestamp = Math.floor(Date.parse(match[3]) / 1000) ;
			if (!lastTimestamp || lastTimestamp < timestamp) {
				// found a new track!
				newSongCallback(artist, track, timestamp);
				lastTimestamp = timestamp;
			}
		}
	});
}

var file = process.argv[2];

authenticateSession(function() {
	loadSongHistory(file, scrobble);
});

