import playlistDAO from "../DAO/playlistDAO";

const playlistBUS = {
  async getPlaylist(id: string) {
    try {
      return playlistDAO.getPlaylist(id);
    } catch (error) {
      throw error;
    }
  },

  async getPlaylistByIdPL(uid: string, plid: string) {
    try {
      return await playlistDAO.getPlaylistByIdPL(uid, plid);
    } catch (error) {
      throw error;
    }
  },

  async addPlaylist(idUser: string, name: string) {
    try {
      await playlistDAO.addPlaylist(idUser, name);
    } catch (error) {
      throw error;
    }
  },

  async addSongInPlaylist(idUser: string, idPL: string, idSongs: number) {
    try {
      await playlistDAO.addSongInPlaylist(idUser, idPL, idSongs);
    } catch (error) {
      throw error;
    }
  },

  async deleteSongInPlaylist(idUser: string, idPL: string, idSongs: number) {
    try {
      await playlistDAO.deleteSongInPlaylist(idUser, idPL, idSongs);
    } catch (error) {
      throw error;
    }
  },

  async deletePlaylist(idUser: string, idPL: string){
    try {
      await playlistDAO.deletePlaylist(idUser, idPL);
    } catch (error) {
      throw error;
    }
  },

  async updatePlaylist(idUser: string, idPL: string, name: string){
    try {
      console.log(idUser, idPL, name)
      // await playlistDAO.updatePlaylist(idUser, idPL, name);
    } catch (error) {
      throw error;
    }
  }
};

export default playlistBUS;
