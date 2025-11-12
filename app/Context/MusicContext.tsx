import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
type Track = {
  id: string;
  title: string;
  artist: string;
  image: string;
};
type MusicContextType = {
  currentTrack: Track | null;
  playlist: Track[];
  currentIndex: number;
  isPlaying: boolean;
  setCurrentTrack: (track: Track, playlist: Track[], index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  clearPlayer: () => void;
};
const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {});
  const setCurrentTrack = (track: Track, list: Track[], index: number) => {
    setTrack(track);
    setPlaylist(list);
    setIndex(index);
    setIsPlaying(true);
  };
  const clearPlayer = () => {
    setTrack(null);
    setPlaylist([]);
    setIndex(0);
    setIsPlaying(false);
  };
  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        playlist,
        currentIndex,
        isPlaying,
        setCurrentTrack,
        setIsPlaying,
        clearPlayer,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw Error("Lỗi sử dụng useMusic");
  return context;
};
