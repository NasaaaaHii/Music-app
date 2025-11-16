export async function searchTrackAPI(query: string) {
  try {
    const res = await fetch(
      `https://discoveryprovider.audius.co/v1/tracks/search?query=${encodeURIComponent(query)}&limit=20`
    );
    const data = await res.json();
    return data;
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
  }
}

async function getAudiusHost() {
  const response = await fetch("https://api.audius.co");
  const hosts = await response.json();
  const host = hosts.data[Math.floor(Math.random() * hosts.data.length)];
  return host;
}

export async function getTrackStreamUrl(trackId: number) {
  const host = await getAudiusHost();
  const streamUrl = `${host}/v1/tracks/${trackId}/stream?app_name=musicapp`;
  return streamUrl;
}

export async function getTrack(id: number | string) {
  try {
    const res = await fetch(
      `https://discoveryprovider.audius.co/v1/tracks/${id}`
    );
    const data = await res.json();
    return data.data;
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
  }
}

export async function searchAlbum(title: string) {
  try {
    const res = await fetch(
      `https://discoveryprovider.audius.co/v1/playlists/search?query=${title}&limit=50`
    );
    const data = await res.json();
    return data.data;
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
  }
}

export async function topAlbum() {
  try {
    const res = await fetch(
      `https://discoveryprovider.audius.co/v1/playlists/trending`
    );
    const data = await res.json();
    return data.data;
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
  }
}

export async function getTrendingTracks(limit = 10, time: "day" | "week" | "month" = "week") {
  try {
    const res = await fetch(
      `https://discoveryprovider.audius.co/v1/tracks/trending?time=${time}&limit=${limit}`
    );
    const data = await res.json();
    return data.data ?? [];
  } catch (e) {
    const err = e as Error;
    console.log(err.message);
    return [];
  }
}