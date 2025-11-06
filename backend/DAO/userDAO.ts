import { getDoc, setDoc } from "firebase/firestore";
import { doc, FIRESTORE_DB } from "../../config/firebaseConfig";

const userDAO = {
  async getUserById(id: string) {
    try {
      const ref = doc(FIRESTORE_DB, "users", id);
      const snap = await getDoc(ref);
      return snap.exists() ? snap.data() : null;
    } catch (error) {
      throw error;
    }
  },

  async addUser(email: string, id: string) {
    try {
      const ref = doc(FIRESTORE_DB, "users", id);
      await setDoc(
        ref,
        {
          email: email,
          liked: [],
          downloaded: [],
          playlists: [],
        },
        { merge: true }
      );
    } catch (error) {
      throw error;
    }
  },
};

export default userDAO;
