# RivendellScrobbler
Last.fm scrobbler script targeting Rivendell now playing audio output file

Starts script checking for updates to input file,
expecting live audio data from Rivendell of the form:
`[artist] --- [track]`

Will scrobble new updates to Last.fm with api data from `passwords.json`:
{
	"lastfm_user": "...",
	"lastfm_password": "...",
    "lastfm_api_key" : "...",
    "lastfm_secret" : "..."
}

Will check audio file for updates, scrobbling when new data is encountered:

```
$ node app.js audio.txt 
checking for new audio data...
checking for new audio data...
checking for new audio data...
checking for new audio data...
checking for new audio data...
checking for new audio data...
checking for new audio data...
1/22/2017, 9:21:41 PM found a new track to scrobble: The Velvet Underground --- Some Kind of Love
Scrobbled: { '@attr': { accepted: 1, ignored: 0 },
  scrobble: 
   { artist: { corrected: '0', '#text': 'The Velvet Underground' },
     ignoredMessage: { code: '0', '#text': '' },
     albumArtist: { corrected: '0', '#text': '' },
     timestamp: '1485120101',
     album: { corrected: '0' },
     track: { corrected: '0', '#text': 'Some Kind of Love' } } }
checking for new audio data...
checking for new audio data...
```
