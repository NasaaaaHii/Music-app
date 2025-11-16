import searchDAO, { PlaylistResponse, TrackResponse } from "../DAO/searchDAO";

export type FormattedTrack = {
  id: string;
  track_id: number;
  title: string;
  artists: string[];
  image: string;
};

export type FormattedPlaylist = {
  id: string;
  title: string;
  image: string;
};

const DEFAULT_ARTWORK = "https://cdn-icons-png.flaticon.com/512/727/727245.png";

const parseTrackId = (
  id: string | number | undefined,
  trackId?: number
): number => {
  if (trackId) return trackId;
  if (typeof id === "number") return id;
  if (typeof id === "string") {
    const numId = parseInt(id, 10);
    return isNaN(numId) ? 0 : numId;
  }
  return 0;
};

function formatTrack(item: TrackResponse): FormattedTrack {
  let artistList: string[] = [];
  if (item.artists && item.artists.length > 0) {
    artistList = item.artists
      .map((a) => (typeof a === "string" ? a : a?.name))
      .filter((name): name is string => Boolean(name?.trim()));
  }
  if (artistList.length === 0) {
    artistList = item.user?.name
      ? [item.user.name]
      : item.artist
        ? [item.artist]
        : ["Unknown Artist"];
  }
  const artworkUrl =
    item.artwork?.["1000x1000"] ||
    item.artwork?.["480x480"] ||
    item.artwork?.["150x150"] ||
    item.image ||
    (typeof item.artwork === "string" ? item.artwork : null) ||
    DEFAULT_ARTWORK;

  return {
    id: item.id || item.track_id?.toString() || Math.random().toString(),
    track_id: parseTrackId(item.id, item.track_id),
    title: item.title || "Unknown Title",
    artists: artistList,
    image: artworkUrl,
  };
}

function formatPlaylist(item: PlaylistResponse): FormattedPlaylist {
  const artworkUrl =
    item.artwork?.["1000x1000"] ||
    item.artwork?.["480x480"] ||
    item.artwork?.["150x150"] ||
    item.image ||
    DEFAULT_ARTWORK;

  return {
    id: item.id,
    title: item.playlist_name || "Playlist",
    image: artworkUrl,
  };
}

const searchBUS = {
  async searchTracks(
    query: string,
    limit: number = 20
  ): Promise<FormattedTrack[]> {
    try {
      if (!query.trim()) {
        return [];
      }
      const data = await searchDAO.searchTracks(query, limit);
      if (!Array.isArray(data)) {
        return [];
      }
      return data.map(formatTrack);
    } catch (error) {
      throw error;
    }
  },
  async getTrendingTracks(
    limit: number = 10,
    time: "day" | "week" | "month" = "week"
  ): Promise<FormattedTrack[]> {
    try {
      const data = await searchDAO.getTrendingTracks(limit, time);

      if (!Array.isArray(data)) {
        return [];
      }

      return data.map(formatTrack);
    } catch (error) {
      console.error("Get trending tracks BUS error:", error);
      throw error;
    }
  },
  async getTrackById(trackId: number | string): Promise<FormattedTrack | null> {
    try {
      const data = await searchDAO.getTrackById(trackId);
      if (!data) return null;
      return formatTrack(data);
    } catch (error) {
      console.error("Get track BUS error:", error);
      throw error;
    }
  },
  async getTrackStreamUrl(trackId: number): Promise<string> {
    try {
      return await searchDAO.getTrackStreamUrl(trackId);
    } catch (error) {
      console.error("Get stream URL BUS error:", error);
      throw error;
    }
  },
  async getTrendingPlaylists(): Promise<FormattedPlaylist[]> {
    try {
      const data = await searchDAO.getTrendingPlaylists();

      if (!Array.isArray(data)) {
        return [];
      }

      return data.map(formatPlaylist);
    } catch (error) {
      console.error("Get trending playlists BUS error:", error);
      throw error;
    }
  },
};
export default searchBUS;
