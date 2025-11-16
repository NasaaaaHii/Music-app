import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { FIRESTORE_DB } from "../../config/firebaseConfig";

type PlayList = {
  id: string;
  name: string;
  songs: any[];
};

const playlistDAO = {
  async getPlaylist(idUser: string): Promise<PlayList[]> {
    try {
      const ref = collection(FIRESTORE_DB, "users", idUser, "playlists");
      const response = await getDocs(ref);

      return response.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as PlayList
      );
    } catch (e) {
      throw e;
    }
  },

  async getPlaylistByIdPL(uid: string, plid: string): Promise<PlayList> {
    try {
      const ref = doc(FIRESTORE_DB, "users", uid, "playlists", plid);
      const response = await getDoc(ref);
      return response.data() as PlayList;
    } catch (error) {
      throw error;
    }
  },

  async addPlaylist(userId: string, name: string) {
    try {
      const ref = collection(FIRESTORE_DB, "users", userId, "playlists");
      await addDoc(ref, {
        name: name,
        songs: [],
      });
    } catch (e) {
      console.log("PLAYLISTDAO - ERROR");
      throw e;
    }
  },

  async addSongInPlaylist(uid: string, plid: string, songid: number) {
    try {
      const ref = doc(FIRESTORE_DB, "users", uid, "playlists", plid);
      await setDoc(
        ref,
        {
          songs: arrayUnion(songid),
        },
        { merge: true }
      );
    } catch (error) {
      throw error;
    }
  },

  async deleteSongInPlaylist(uid: string, plid: string, songid: number) {
    try {
      const ref = doc(FIRESTORE_DB, "users", uid, "playlists", plid);
      await updateDoc(ref, {
        songs: arrayRemove(songid),
      });
    } catch (error) {
      throw error;
    }
  },

  async deletePlaylist(uid: string, plid: string){
    try {
      const ref = doc(FIRESTORE_DB, "users", uid, "playlists", plid);
      await deleteDoc(ref)
    } catch (error) {
      throw error;
    }
  },

  async updatePlaylist(uid: string, plid: string, name: string){
    try {
      const ref = doc(FIRESTORE_DB, "users", uid, "playlists", plid);
      await updateDoc(ref, {
        name: name
      })
    } catch (error) {
      throw error;
    }
  },
};

export default playlistDAO;
