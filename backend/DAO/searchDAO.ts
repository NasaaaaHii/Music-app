type TrackResponse = {
  id: string;
  track_id?: number;
  title: string;
  artists?: Array<{ name: string }>;
  user?: { name: string };
  artist?: string;
  artwork?: {
    "1000x1000"?: string;
    "480x480"?: string;
    "150x150"?: string;
  };
  image?: string;
  access?: {
    download?: boolean;
    stream?: boolean;
  };
};

type PlaylistResponse = {
  id: string;
  playlist_name?: string;
  artwork?: {
    "1000x1000"?: string;
    "480x480"?: string;
    "150x150"?: string;
  };
  image?: string;
};

const AUDIUS_DISCOVERY_URL = "https://discoveryprovider.audius.co";
const AUDIUS_API_URL = "https://api.audius.co";

async function getAudiusHost(): Promise<string> {
  try {
    const res = await fetch(AUDIUS_API_URL);
    const hosts = await res.json();
    if (!hosts.data || hosts.data.length === 0) {
      throw new Error("Khong ket noi duoc voi host");
    }
    return hosts.data[Math.floor(Math.random() * hosts.data.length)];
  } catch (error) {
    throw new Error(`ket noi den audius that bai: ${error}`);
  }
}

const searchDAO = {
  async searchTracks(
    query: string,
    limit: number = 20
  ): Promise<TrackResponse[]> {
    try {
      const url = `${AUDIUS_DISCOVERY_URL}/v1/tracks/search?query=${encodeURIComponent(query)}&limit=${limit}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`loi api:  ${res.status}`);
      }
      const data = await res.json();
      return data.data || data || [];
    } catch (error: any) {
      throw new Error(`tim kiem that bai: ${error.message}`);
    }
  },
  async getTrendingTracks(
    limit: number = 10,
    time: "day" | "week" | "month" = "week"
  ): Promise<TrackResponse[]> {
    try {
      const url = `${AUDIUS_DISCOVERY_URL}/v1/tracks/trending?time=${time}&limit=${limit}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`loi api:  ${res.status}`);
      }
      const data = await res.json();
      return data.data || [];
    } catch (error: any) {
      throw new Error(`tim kiem that bai: ${error.message}`);
    }
  },
  async getTrackById(trackId: number | string): Promise<TrackResponse | null> {
    try {
      const url = `${AUDIUS_DISCOVERY_URL}/v1/tracks/${trackId}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`loi api:  ${res.status}`);
      }
      const data = await res.json();
      return data.data || null;
    } catch (error: any) {
      throw new Error(`tim kiem that bai: ${error.message}`);
    }
  },
  async getTrackStreamUrl(trackId: number): Promise<string> {
    try {
      const host = await getAudiusHost();
      return `${host}/v1/tracks/${trackId}/stream?app_name=musicapp`;
    } catch (error) {
      const err = error as Error;
      throw new Error(`get api stream that bai: ${err.message}`);
    }
  },
  async getTrendingPlaylists(): Promise<PlaylistResponse[]> {
    try {
      const url = `${AUDIUS_DISCOVERY_URL}/v1/playlists/trending`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`loi api:  ${res.status}`);
      }
      const data = await res.json();
      return data.data || [];
    } catch (error: any) {
      throw new Error(`Get trending playlist that bai: ${error.message}`);
    }
  },
  async searchPlaylists(
    query: string,
    limit: number = 50
  ): Promise<PlaylistResponse[]> {
    try {
      const url = `${AUDIUS_DISCOVERY_URL}/v1/playlists/search?query=${encodeURIComponent(query)}&limit=${limit}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`loi api:  ${res.status}`);
      }
      const data = await res.json();
      return data.data || [];
    } catch (error: any) {
      throw new Error(`tim kiem that bai: ${error.message}`);
    }
  },
};

export default searchDAO;
export type { PlaylistResponse, TrackResponse };
