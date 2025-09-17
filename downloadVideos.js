// Handles video/song downloads
// downloadVideos.js
import ytdl from 'ytdl-core';
import ytSearch from 'yt-search';
import fs from 'fs';
import path from 'path';

export async function downloadVideosFromTitles(titles) {
  // Ensure downloads folder exists
  const downloadsDir = path.resolve('./downloads');
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
  }

  for (const title of titles) {
    try {
      console.log(`Searching YouTube for: ${title}`);
      const r = await ytSearch(title);
      if (!r || !r.videos || r.videos.length === 0) {
        console.log(`No results for ${title}`);
        continue;
      }
      const video = r.videos[0]; // first result
      const url = video.url;
      console.log(`Downloading: ${video.title}`);

      // File name safe
      const fileName = video.title.replace(/[\\/:*?"<>|]/g, '') + '.mp3';
      const output = path.join(downloadsDir, fileName);

      const stream = ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio',
      }).pipe(fs.createWriteStream(output));

      await new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
      });

      console.log(`Downloaded ${fileName}`);
    } catch (err) {
      console.error(`Error downloading ${title}:`, err);
    }
  }
  console.log('All downloads complete!');
}
