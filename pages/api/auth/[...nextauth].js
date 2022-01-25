import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

async function refreshAccessToken(token){
  try {
    
    //刷新accessToken这个操作本身也需要权限，所以才需要一个refreshToken，且refreshToken不会失效
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshToken();
    console.log("REFRESHED TOKEN IS", refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken
    }

  } catch (error) {
    console.error(error);
    return {
      ...token,
      error:'RefreshAccessTokenError'
    }
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      //spotify的登陆程序会通过把用户信息发送到此LOGIN_URL的方式进行初始化，假如此用户已经登陆，那就不会弹出spotify的登陆页面
      authorization: LOGIN_URL
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks:{
    async jwt({ token, account, user }){

      // 不是很懂这个地方的逻辑
      // initial sign in
      if(account && user){
        return{
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000
        }
      }

      //如果当前这个token还没有过期，则直接返回
      if( Date.now() < token.accessTokenExpires ){
        console.log("EXISTING ACCESS TOKEN IS VALID");
        return token;
      }

      //如果当前token已经过期，则需要刷新
      console.log("EXISTING ACCESS TOKEN HAS EXPIRED, REFRESHING...");
      return await refreshAccessToken(token)
    },

    async session({ session, token }){
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;
      return session;
    }
  },
})