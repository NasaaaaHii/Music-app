const CLIENT_ID = null
const CLIENT_SECRET= null
let TOKEN: string | null = null;

async function LoadToken() {
  TOKEN = await GetAPIToken();
}

function GetAPIToken() {
  const url = `https://accounts.spotify.com/api/token`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(CLIENT_ID + ":" + CLIENT_SECRET)}`,
    },
    body: "grant_type=client_credentials",
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res.access_token;
    })
    .catch((err) => {
      console.log(err);
    });
}

export async function SearchAPITracks(query: string, limit: number) {
  if (TOKEN === null) {
    await LoadToken()
  }
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`;
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
        return res.tracks.items
    })
    .catch((err) => {
      console.log(err);
    });
}