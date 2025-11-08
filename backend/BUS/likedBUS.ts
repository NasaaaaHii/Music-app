import likedDAO from "../DAO/likedDAO";

const likedBUS = {
  async getLiked(uid: string) {
    try {
      return likedDAO.getLiked(uid);
    } catch (error) {
      throw error;
    }
  },

  async addLiked(uid: string, idMusic: number) {
    try {
      likedDAO.addLiked(uid, idMusic);
    } catch (error) {
      throw error;
    }
  },

  async deleteLiked(uid: string, idMusic: number) {
    try {
      likedDAO.deleteLiked(uid, idMusic);
    } catch (error) {
      throw error;
    }
  },
};

export default likedBUS;
