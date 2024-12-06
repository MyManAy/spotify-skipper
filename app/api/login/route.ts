import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

const generateRandom16Chars = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let built = "";

  for (let i = 0; i < 16; i++) {
    built += characters[Math.floor(Math.random() * characters.length)];
  }

  return built;
};

export async function GET() {
  const state = generateRandom16Chars();
  const scope = "user-read-private user-read-email";
  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://spotify-skipper.vercel.app"
      : "http://localhost:3000";

  const redirectUrl = BASE_URL + "/api/callback";

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    scope: scope,
    redirect_uri: redirectUrl,
    state: state,
    show_dialog: "true",
  });

  return NextResponse.redirect(
    "https://accounts.spotify.com/authorize?" + params.toString()
  );
}
