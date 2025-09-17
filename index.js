// index.js


import express from 'express';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import SpotifyWebApi from 'spotify-web-api-node';
import { downloadVideosFromTitles } from './downloadVideos.js';


dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(
  cookieSession({
    name: 'sdmp3-session',
    keys: [process.env.SESSION_SECRET],
  })
);

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri:  (process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/callback').trim()
})
// Check for required environment variables and expose a friendly message
const requiredEnv = [
  'SPOTIFY_CLIENT_ID',
  'SPOTIFY_CLIENT_SECRET',
  'SPOTIFY_REDIRECT_URI',
  'SESSION_SECRET',
];
const missingEnv = requiredEnv.filter((k) => !process.env[k]);
const hasMissingEnv = missingEnv.length > 0;

const scopes = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
];

// 1️⃣ Redirect to Spotify login
app.get('/', (req, res) => {
  if (hasMissingEnv) {
    res.status(500).send(`
      <h1>Missing required environment variables</h1>
      <p>The following environment variables are not set:</p>
      <pre>${missingEnv.join('\n')}</pre>
      <p>Create a <code>.env</code> file based on <code>.env.example</code> and restart the app.</p>
    `);
    return;
  }

  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
});

// 2️⃣ Callback after login
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    req.session.accessToken = data.body['access_token'];
    req.session.refreshToken = data.body['refresh_token'];
    spotifyApi.setAccessToken(req.session.accessToken);
    spotifyApi.setRefreshToken(req.session.refreshToken);
    res.redirect('/playlists');
  } catch (err) {
    console.error(err);
    res.send('Error retrieving access token');
  }
});

// 3️⃣ Display user playlists
app.get('/playlists', async (req, res) => {
  if (!req.session.accessToken) return res.redirect('/');

  spotifyApi.setAccessToken(req.session.accessToken);

  try {
    const playlists = await spotifyApi.getUserPlaylists({ limit: 50 });
    res.render('playlists', { playlists: playlists.body.items });
  } catch (err) {
    console.error(err);
    res.send('Error fetching playlists');
  }
});

// 4️⃣ Display tracks in a playlist
app.get('/tracks/:playlistId', async (req, res) => {
  if (!req.session.accessToken) return res.redirect('/');
  spotifyApi.setAccessToken(req.session.accessToken);

  const playlistId = req.params.playlistId;
  try {
    const tracksData = await spotifyApi.getPlaylistTracks(playlistId, {
      limit: 20,
    });
    const tracks = tracksData.body.items.map((i) => i.track.name);

    // Download the songs asynchronously
    downloadVideosFromTitles(tracks)
      .then(() => console.log('Download complete'))
      .catch((err) => console.error(err));

    res.render('tracks', { tracks });
  } catch (err) {
    console.error(err);
    res.send('Error fetching tracks');
  }
});

//Download
app.get('/tracks/:playlistId', async (req, res) => {
  if (!req.session.accessToken) return res.redirect('/');
  spotifyApi.setAccessToken(req.session.accessToken);

  const playlistId = req.params.playlistId;
  try {
    const tracksData = await spotifyApi.getPlaylistTracks(playlistId, {
      limit: 20,
    });
    const tracks = tracksData.body.items.map((i) => i.track.name);

    // Download the songs asynchronously
    downloadVideosFromTitles(tracks)
      .then(() => console.log('Download complete'))
      .catch((err) => console.error(err));

    res.render('tracks', { tracks });
  } catch (err) {
    console.error(err);
    res.send('Error fetching tracks');
  }
});
// Refresh token automatically if expired (optional)
async function refreshAccessToken(req) {
  spotifyApi.setRefreshToken(req.session.refreshToken);
  const data = await spotifyApi.refreshAccessToken();
  req.session.accessToken = data.body['access_token'];
  spotifyApi.setAccessToken(req.session.accessToken);
}

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
