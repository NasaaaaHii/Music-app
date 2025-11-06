import playlistDAO from "../DAO/playlistDAO";

const playlistBUS = {
    async getPlaylist(id: string){
        try {
            return playlistDAO.getPlaylist(id);
        } catch (error) {
            throw error;
        }
    },

    async addPlaylist(idUser: string, name: string){
        try{
            playlistDAO.addPlaylist(idUser, name)
        }
        catch(error){
            throw error
        }
    }
};

export default playlistBUS;