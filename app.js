// rivendellscrobbler
// app.js

var LastfmAPI = require('lastfmapi');
var passwords = require('./passwords.json');

var lfm = new LastfmAPI({
    'api_key' : passwords.lastfm_api_key,
    'secret' : passwords.lastfm_secret
});

function authentication(callback) {
	lfm.auth.getMobileSession(passwords.lastfm_user, passwords.lastfm_password, function(err, session) {
		lfm.setSessionCredentials(session.username, session.key);
		callback();
	});
}

function scrobble(artist, track) {
	lfm.track.scrobble({
	    'artist' : artist,
	    'track' : track,
	    'timestamp' : Math.floor((new Date()).getTime() / 1000)
	}, function (err, scrobbles) {
	    if (err) { return console.log('Failed to scrobble!', artist, track, ":", err); }
	    console.log('Scrobbled:', scrobbles);
	});
}

lfm.auth.getMobileSession(passwords.lastfm_user, passwords.lastfm_password, function(err, session) {
	console.log(err);
	console.log(session);
	console.log("finished.");
	lfm.setSessionCredentials(session.username, session.key);

	
});





