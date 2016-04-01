# Music Streamer

A simple draft for a BitTorrent-based P2P project.

## Setup

Run `npm i` and ensure it successes, it requires the alsa-dev library.

## Usage

Start the tracker;
```bash
npm run tracker
```
Then start the seeding of res/Pixelland.mp3
```bash
npm start
```
Now start the leech / music player;
```bash
node main.js leech "magnet:?..."
```
Where the magnet link is the one provided by the seeder in the console.
