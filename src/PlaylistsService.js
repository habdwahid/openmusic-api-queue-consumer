const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool()
  }

  async getPlaylists(playlistId) {
    const queryPlaylist = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [playlistId],
    }
    const querySongs = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs LEFT JOIN songs_playlist ON songs_playlist.song_id = songs.id WHERE songs_playlist.playlist_id = $1',
      values: [playlistId],
    }

    const playlist = await this._pool.query(queryPlaylist)
    const songs = await this._pool.query(querySongs)

    return {
      id: playlist.rows[0].id,
      name: playlist.rows[0].name,
      songs: songs.rows,
    }
  }
}

module.exports = PlaylistsService
