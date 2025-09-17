# 🎵 Spotify Playlist Downloader (Node.js)

This project authenticates users with Spotify, lists their playlists, and downloads the tracks as videos using **YouTube** (via `downloadVideos.js`).  
It’s a Node.js + Express app using Spotify Web API and EJS for views.

---

## 🚀 Features

- Login with Spotify (OAuth2)
- View all your Spotify playlists
- View tracks in each playlist
- Automatically download tracks as videos using `downloadVideos.js`
- Session-based authentication using cookies

---

## 📂 Project Structure

```
.
├── index.js                # Main Express app
├── downloadVideos.js       # Downloads videos from titles
├── views/
│   ├── playlists.ejs       # Displays playlists
│   └── tracks.ejs          # Displays tracks
├── public/                 # Static assets (CSS, images, JS)
├── .env                    # Environment variables (not committed)
├── .env.example            # Example env file to share
├── package.json
└── README.md
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
SESSION_SECRET=your_session_secret
```

### Where to get these:
- **SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET** → [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)
- **SPOTIFY_REDIRECT_URI** → Must match your app settings (e.g. `http://localhost:3000/callback`)
- **SESSION_SECRET** → Any random string for cookie signing

---

## 🛠 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/spotify-playlist-downloader.git
   cd spotify-playlist-downloader
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your `.env` file as shown above.

4. Run the app:
   ```bash
   node index.js
   ```
   or (if using nodemon)
   ```bash
   nodemon index.js
   ```

---

## 💻 Usage

1. Go to [http://localhost:3000](http://localhost:3000).
2. Click login to authenticate with Spotify.
3. Select a playlist to view tracks.
4. Tracks automatically trigger `downloadVideos.js` to download the videos.

---

## 🔒 Notes

- For local development, you can safely use:
  ```
  http://localhost:3000/callback
  ```
  in Spotify settings.  
- For production, you must use HTTPS and update your Spotify redirect URI accordingly.
- Keep your `.env` file private — never commit it.

---

## 📝 License

MIT License © 2025 [Your Name]

---

## 🤝 Contributing

Pull requests and issues are welcome!
