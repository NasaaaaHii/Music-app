import { Audio } from "expo-av";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import searchBUS from "../../backend/BUS/searchBUS";
type Track = {
  id: string;
  title: string;
  artist: string;
  image: string;
  url?: string;
  track_id?: number;
  duration?: number;
};
type MusicContextType = {
  currentTrack: Track | null;
  playlist: Track[];
  currentIndex: number;
  isPlaying: boolean;
  url: string | null;
  isLoadingTrack: boolean;
  setCurrentTrack: (
    track: Track,
    playlist: Track[],
    index: number,
    urlName: string,
    duration: number
  ) => Promise<void>;
  setIsPlaying: (playing: boolean) => void;
  clearPlayer: () => void;
  setUrl: (url: string) => void;
  play: () => Promise<void>;
  pause: () => void;
  replace: (url: string, requestId?: string) => Promise<void>;
  process: number;
  duration: number;
  handleSeek: (value: number) => void;
  nextTrack: () => Promise<void>;
  prevTrack: () => Promise<void>;
  hasNextTrack: boolean;
  hasPrevTrack: boolean;
};
export const MusicContext = createContext<MusicContextType | undefined>(
  undefined
);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [url, setUrl] = useState<string | null>("");
  const [isLoadingTrack, setIsLoadingTrack] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [duration, setDuration] = useState(0);
  const [process, setProcess] = useState(0);
  const [soundLoaded, setSoundLoaded] = useState(false);
  const currentRequestRef = useRef<{
    trackId: string;
    cancelled: boolean;
  } | null>(null);
  useEffect(() => {
    const sound = soundRef.current;
    if (!sound) return;

    const updateStatus = async () => {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (status.positionMillis !== undefined) {
            setProcess(status.positionMillis / 1000);
          }
          if (
            status.durationMillis !== undefined &&
            status.durationMillis > 0
          ) {
            setDuration(status.durationMillis / 1000);
          }
          setIsPlaying(status.isPlaying || false);
        }
      } catch (error) {
        console.error("Error updating status:", error);
      }
    };

    const interval = setInterval(updateStatus, 100);

    return () => {
      clearInterval(interval);
    };
  }, [url, soundLoaded]);
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
      soundRef.current = null;
    };
  }, []);
  const play = async () => {
    try {
      const sound = soundRef.current;
      if (sound) {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Play error:", error);
    }
  };
  const pause = async () => {
    try {
      const sound = soundRef.current;
      if (sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Pause error:", error);
    }
  };
  const replace = async (newUrl: string, requestId?: string) => {
    if (requestId && currentRequestRef.current) {
      if (
        currentRequestRef.current.cancelled ||
        currentRequestRef.current.trackId !== requestId
      ) {
        console.log("Replace cancelled for request:", requestId);
        return;
      }
    }

    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: newUrl },
        { shouldPlay: true }
      );

      soundRef.current = sound;
      setSoundLoaded(true);

      if (requestId && currentRequestRef.current) {
        if (
          currentRequestRef.current.cancelled ||
          currentRequestRef.current.trackId !== requestId
        ) {
          console.log("Play cancelled for request:", requestId);
          await sound.unloadAsync();
          soundRef.current = null;
          setSoundLoaded(false);
          return;
        }
      }

      setIsPlaying(true);
    } catch (error) {
      console.error("Replace error:", error);
      setSoundLoaded(false);
    }
  };
  const handleSeek = async (value: number) => {
    try {
      const sound = soundRef.current;
      if (sound && !isNaN(value)) {
        await sound.setPositionAsync(value * 1000);
        setProcess(value);
      }
    } catch (error) {
      console.error("Seek error:", error);
    }
  };
  const setCurrentTrack = async (
    track: Track,
    list: Track[],
    index: number,
    urlName: string,
    duration: number
  ) => {
    if (currentRequestRef.current) {
      currentRequestRef.current.cancelled = true;
    }

    const requestId = track.id;
    currentRequestRef.current = { trackId: requestId, cancelled: false };
    setIsLoadingTrack(true);

    try {
      setTrack(track);
      setPlaylist(list);
      setIndex(index);
      setUrl(urlName);
      setDuration(duration);
      setProcess(0);
      if (
        currentRequestRef.current.cancelled ||
        currentRequestRef.current.trackId !== requestId
      ) {
        console.log("setCurrentTrack cancelled for:", track.title);
        return;
      }
      await replace(urlName, requestId);

      if (
        currentRequestRef.current.cancelled ||
        currentRequestRef.current.trackId !== requestId
      ) {
        console.log("setCurrentTrack cancelled after replace:", track.title);
        return;
      }

      setIsPlaying(true);
    } catch (error) {
      if (
        currentRequestRef.current &&
        !currentRequestRef.current.cancelled &&
        currentRequestRef.current.trackId === requestId
      ) {
        console.error("Error in setCurrentTrack:", error);
        setIsPlaying(false);
      }
    } finally {
      if (
        currentRequestRef.current &&
        currentRequestRef.current.trackId === requestId
      ) {
        setIsLoadingTrack(false);
      }
    }
  };

  const nextTrack = async () => {
    if (playlist.length === 0 || currentIndex === -1) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex >= playlist.length) {
      return;
    }
    const nextTrackItem = playlist[nextIndex];
    if (!nextTrackItem) {
      return;
    }
    try {
      let streamUrl: string;
      if (nextTrackItem.url) {
        streamUrl = nextTrackItem.url;
      } else if (nextTrackItem.track_id) {
        if (!nextTrackItem.track_id || nextTrackItem.track_id === 0) {
          return;
        }
        streamUrl = await searchBUS.getTrackStreamUrl(nextTrackItem.track_id);
        if (!streamUrl || !streamUrl.trim()) {
          return;
        }
      } else {
        console.warn("Track không có URL , track_id");
        return;
      }
      await setCurrentTrack(
        nextTrackItem,
        playlist,
        nextIndex,
        streamUrl,
        nextTrackItem.duration || 0
      );
    } catch (error) {
      throw new Error("Loi khong the next");
    }
  };

  const prevTrack = async () => {
    if (playlist.length === 0 || currentIndex === -1) return;

    const prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      return;
    }

    const prevTrackItem = playlist[prevIndex];
    if (!prevTrackItem) return;

    try {
      let streamUrl: string;

      if (prevTrackItem.url) {
        streamUrl = prevTrackItem.url;
      } else if (prevTrackItem.track_id) {
        if (!prevTrackItem.track_id || prevTrackItem.track_id === 0) {
          console.warn("Invalid track_id");
          return;
        }
        streamUrl = await searchBUS.getTrackStreamUrl(prevTrackItem.track_id);

        if (!streamUrl || !streamUrl.trim()) {
          console.warn("Không thể lấy stream URL");
          return;
        }
      } else {
        console.warn("Track không có URL hoặc track_id");
        return;
      }

      await setCurrentTrack(
        prevTrackItem,
        playlist,
        prevIndex,
        streamUrl,
        prevTrackItem.duration || 0
      );
    } catch (error) {
      console.error("Prev track error:", error);
    }
  };
  const clearPlayer = async () => {
    if (currentRequestRef.current) {
      currentRequestRef.current.cancelled = true;
    }
    currentRequestRef.current = null;

    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (error) {
      console.error("Clear player error:", error);
    }
    setSoundLoaded(false);
    setTrack(null);
    setPlaylist([]);
    setIndex(0);
    setIsPlaying(false);
    setIsLoadingTrack(false);
    setUrl(null);
  };
  const hasNextTrack =
    playlist.length > 0 &&
    currentIndex >= 0 &&
    currentIndex < playlist.length - 1;
  const hasPrevTrack = playlist.length > 0 && currentIndex > 0;
  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        playlist,
        currentIndex,
        isPlaying,
        url,
        isLoadingTrack,
        setCurrentTrack,
        setIsPlaying,
        clearPlayer,
        setUrl,
        play,
        pause,
        replace,
        process,
        duration,
        handleSeek,
        nextTrack,
        prevTrack,
        hasNextTrack,
        hasPrevTrack,
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
