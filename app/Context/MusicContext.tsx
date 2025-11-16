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
  const playerRef = useRef<HTMLAudioElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [process, setProcess] = useState(0);
  const currentRequestRef = useRef<{
    trackId: string;
    cancelled: boolean;
  } | null>(null);
  useEffect(() => {
    const audio = audioRef.current;
    const player = playerRef.current;

    if (!audio || !player) {
      return;
    }
    const updateProcess = () => {
      const currentTime = audio.currentTime || player.currentTime;
      if (!isNaN(currentTime) && isFinite(currentTime)) {
        setProcess(currentTime);
      }
    };
    const updateDuration = () => {
      const duration = audio.duration || player.duration;
      if (!isNaN(duration) && isFinite(duration) && duration > 0) {
        setDuration(duration);
        if (process > duration) {
          setProcess(0);
        }
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setProcess(0);
    };
    const handleCanPlay = () => {
      if (audio && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handlePause = () => {
      setIsPlaying(false);
    };
    const handlePlay = () => {
      setIsPlaying(true);
    };

    audio.addEventListener("timeupdate", updateProcess);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("loadeddata", updateDuration);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    player.addEventListener("timeupdate", updateProcess);
    player.addEventListener("loadedmetadata", updateDuration);
    player.addEventListener("loadeddata", updateDuration);
    player.addEventListener("canplay", handleCanPlay);
    player.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProcess);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("loadeddata", updateDuration);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);

      player.removeEventListener("timeupdate", updateProcess);
      player.removeEventListener("loadedmetadata", updateDuration);
      player.removeEventListener("loadeddata", updateDuration);
      player.removeEventListener("canplay", handleCanPlay);
      player.removeEventListener("ended", handleEnded);
    };
  }, [url]);
  useEffect(() => {
    if (!playerRef.current) {
      playerRef.current = new Audio();
    }
    return () => {
      playerRef.current?.pause();
      playerRef.current = null;
    };
  }, []);
  const play = async () => {
    try {
      const player = playerRef.current;
      const audio = audioRef.current;

      if (player && audio) {
        await Promise.all([player.play(), audio.play()]);
      } else if (player) {
        await player.play();
      } else if (audio) {
        await audio.play();
      }

      setIsPlaying(true);
    } catch (error) {
      console.error("Play error:", error);
    }
  };
  const pause = async () => {
    const player = playerRef.current;
    const audio = audioRef.current;

    if (player) {
      player.pause();
    }
    if (audio) {
      audio.pause();
    }

    setIsPlaying(false);
  };
  const replace = async (newUrl: string, requestId?: string) => {
    if (!playerRef.current || !audioRef.current) return;

    if (requestId && currentRequestRef.current) {
      if (
        currentRequestRef.current.cancelled ||
        currentRequestRef.current.trackId !== requestId
      ) {
        console.log("Replace cancelled for request:", requestId);
        return;
      }
    }

    const player = playerRef.current;
    const audio = audioRef.current;

    if (player.src !== newUrl || audio.src !== newUrl) {
      player.pause();
      audio.pause();

      player.src = newUrl;
      audio.src = newUrl;

      player.load();
      audio.load();
    }

    if (requestId && currentRequestRef.current) {
      if (
        currentRequestRef.current.cancelled ||
        currentRequestRef.current.trackId !== requestId
      ) {
        console.log("Play cancelled for request:", requestId);
        return;
      }
    }

    try {
      await Promise.all([player.play(), audio.play()]);
    } catch (error) {
      console.error("Play error:", error);
      try {
        await player.play();
      } catch (e) {
        try {
          await audio.play();
        } catch (e2) {
          console.error("Both audio elements failed to play");
        }
      }
    }
  };
  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    const player = playerRef.current;

    if (audio && !isNaN(value)) {
      audio.currentTime = value;
      setProcess(value);
    }

    if (player && !isNaN(value)) {
      player.currentTime = value;
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
      playerRef.current?.pause();
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
  const clearPlayer = () => {
    if (currentRequestRef.current) {
      currentRequestRef.current.cancelled = true;
    }
    currentRequestRef.current = null;

    setTrack(null);
    setPlaylist([]);
    setIndex(0);
    setIsPlaying(false);
    setIsLoadingTrack(false);
    setUrl(null);
    playerRef.current?.pause();
    if (playerRef.current) {
      playerRef.current.src = "";
    }
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
      <audio ref={audioRef} src={url ?? undefined} />
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw Error("Lỗi sử dụng useMusic");
  return context;
};
