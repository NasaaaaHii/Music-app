import { collection, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from "../../config/firebaseConfig";

const playlistDAO = {
    async getPlaylist(idUser: string){
        try{
            const ref = collection(FIRESTORE_DB, "users", idUser, "playlists");
            const response = await getDocs(ref);

            return response.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        }
        catch(e){
            throw e;
        }
    },

  async addPlaylist(userId: string, name: string) {
    try {

    } catch (e) {
      throw e;
    }
  },
};

export default playlistDAO;
