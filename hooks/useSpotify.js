import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import spotifyApi from "../lib/spotify";

// const spotifyApi = new SpotifyWebApi({
//   clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
//   clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
// });

function useSpotify() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      // 如果刷新token的尝试失败了，则重定向到登陆页面
      if (session.error === "RefreshAccessTokenError") {
        signIn();
      }
      spotifyApi.setAccessToken(session.user.accessToken);
    }
  }, [session]);

  return spotifyApi;
}

export default useSpotify;
