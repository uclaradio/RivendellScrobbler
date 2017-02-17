// rivendellscrobbler
// app.js

var fs = require('fs');
var path = require('path');
var LastfmAPI = require('lastfmapi');

/*
Start script checking for updates to input file,
expecting live audio data from Rivendell of the form:
`[artist] --- [track]`

Will scrobble new updates to Last.fm with api data from passwords.json:
{
	"lastfm_user": "...",
	"lastfm_password": "...",
    "lastfm_api_key" : "...",
    "lastfm_secret" : "..."
}
*/

var passwords = require('./passwords.json');

var lfm = new LastfmAPI({
	'api_key' : passwords.lastfm_api_key,
	'secret' : passwords.lastfm_secret
});

var lastTimestamp = null;
var storePath = path.resolve(__dirname, "store.json");
var scrobbleHistoryLocation = path.resolve(__dirname, "scrobbleHistory.txt");

/*
Creates a Last.fm session and executes callback within that session
*/
function authenticateSession(callback) {
	lfm.auth.getMobileSession(passwords.lastfm_user, passwords.lastfm_password, function(err, session) {
		if (err) {
			console.log(err);
		}
		lfm.setSessionCredentials(session.username, session.key);
		callback();
	});
}

/*
Scrobble a track on Last.fm
Should be executed within a valid session
*/
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


/*
Set up: write persistent store file if it doesn't exist 
*/
if (!fs.existsSync(storePath)) {
	console.log("writing empty store...");
	fs.writeFile(storePath, "{}", 'utf8');
}

// start script with file from command `node app.js [/path/to/audio.txt]`
// read audio file every 5 seconds, scrobble if updated
var file = process.argv[2];
setInterval(function() {
	console.log("checking for new audio data...");

	var rivendellDataPath = path.resolve(__dirname, file);
	fs.readFile(rivendellDataPath, 'utf8', function(err, rivendellData) {
		if (err) {
			console.log(err);
		} else if (rivendellData) {
			fs.readFile(storePath, 'utf8', function(err, storeData) {
				if (err) {
					console.log(err);
				} else {
					var store = JSON.parse(storeData);

					// read live audio data and scrobble if it's new
					var pattern = /([^\n]*)---([^\n]*)/g;
					var match = pattern.exec(rivendellData);
					if (match) {
						var artist = match[1];
						var track = match[2];
						if (artist && track) {
							artist = artist.trim();
							track = track.trim();
							if (artist && track && (store.artist !== artist || store.track !== track)) {
								// new track -> scrobble & save!
								authenticateSession(function() {
									console.log(new Date().toLocaleString(), 'found a new track to scrobble:', artist, '---', track);
									scrobble(artist, track, Math.floor(Date.now() / 1000));

									var json = JSON.stringify({
										artist: artist,
										track: track
									});
									fs.writeFile(storePath, json, 'utf8');
								});
							}
						}
					}
				}
			});
		}
	});
}, 5000);

