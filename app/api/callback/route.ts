import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const fetchCurrentlyPlaying = async (t : string) => {
    const url = "https://api.spotify.com/v1/me/player/currently-playing";
  
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${t}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data); // Log the currently playing track info
      return data;
    } catch (error) {
      console.error("Error fetching currently playing track:", error);
      throw error;
    }
  };



  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  if (!state) {
    redirect("/#?error=state_mismatch");
  } else {
    const BASE_URL =
      process.env.NODE_ENV === "production"
        ? "https://spotify-skipper.vercel.app"
        : "http://localhost:3000";
    const redirectUrl = BASE_URL + "/api/callback";

    const form = {
      code: code!,
      redirect_uri: redirectUrl,
      grant_type: "authorization_code",
    };

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "post",
      body: new URLSearchParams(form),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID! +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET!
          ).toString("base64"),
      },
    });

    const data = await response.json();

    console.log((data as any).refresh_token);

    fetchCurrentlyPlaying((data as any).access_token)
    .then((data) => {
      // return Response.json({ data });
      console.log("Currently playing:", data.item.name);
    })
    .catch((error) => {
      console.error("Failed to fetch:", error);
    });

    return Response.json({ data });
    1;
  }
}
