import { addDoc, collection, getDoc, setDoc } from "firebase/firestore";
import { doc, FIRESTORE_DB } from "../../config/firebaseConfig";

const userDAO = {
  async getUserById(id: string) {
    try {
      const ref = doc(FIRESTORE_DB, "users", id);
      const snap = await getDoc(ref);
      return snap.data();
    } catch (error) {
      throw error;
    }
  },

  async addUser(email: string, idUser: string) {
    try {
      const ref = doc(FIRESTORE_DB, "users", idUser);
      await setDoc(
        ref,
        {
          email: email,
          liked: [],
          downloaded: [],
        },
        { merge: true }
      );

      const refPlaylists = collection(FIRESTORE_DB, "users", idUser, "playlists");
      await addDoc(
        refPlaylists, {
          name: "Danh sách phát mới",
          songs: []          
        }
      );
    } catch (error) {
      throw error;
    }
  },
};

export default userDAO;