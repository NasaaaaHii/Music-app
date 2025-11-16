import {
  arrayRemove,
  arrayUnion,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { doc, FIRESTORE_DB } from "../../config/firebaseConfig";

type Liked = {
  liked: any[];
};

const likedDAO = {
  async getLiked(uid: string): Promise<Liked> {
    try {
      const ref = doc(FIRESTORE_DB, "users", uid);
      const response = await getDoc(ref);
      return response.data() as Liked;
    } catch (error) {
      throw error;
    }
  },

  async addLiked(uid: string, idMusic: number) {
    try {
      const ref = doc(FIRESTORE_DB, "users", uid);
      await setDoc(
        ref,
        {
          liked: arrayUnion(idMusic),
        },
        { merge: true }
      );
    } catch (error) {
      throw error;
    }
  },

  async deleteLiked(uid: string, idMusic: number) {
    try {
      const ref = doc(FIRESTORE_DB, "users", uid);
      await updateDoc(ref, {
        liked: arrayRemove(idMusic),
      });
    } catch (error) {
      throw error;
    }
  },
};

export default likedDAO;
