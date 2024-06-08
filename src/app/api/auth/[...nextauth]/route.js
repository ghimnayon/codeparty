import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import axios from "axios";
import fs from "fs/promises";
import path from "path";

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24시간
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "kakao") {
        if (profile.id !== null) {
          const userId = profile.id;

          try {
            const profileImageUrl = profile.properties?.profile_image;

            if (profileImageUrl) {
              const imagePath = path.join(process.cwd(), "public", "profile_images", `${userId}.jpg`);
              const response = await axios.get(profileImageUrl, { responseType: 'arraybuffer' });
              await fs.writeFile(imagePath, response.data);
            }

            return true;
          } catch (error) {
            console.error("Error saving profile image:", error);
            return false;
          }
        }
        return false;
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          name: token.name || session.user?.name || "",
          profileImage: token.profileImage || session.user?.profileImage || "",
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        };
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = Date.now() + account.expires_in * 1000;
      }
      
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    },
  },
});

async function refreshAccessToken(token) {
  try {
    const url = "https://kauth.kakao.com/oauth/token";
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("client_id", process.env.KAKAO_CLIENT_ID);
    params.append("refresh_token", token.refreshToken);

    const response = await axios.post(url, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const refreshedTokens = response.data;
    console.log("Refreshed tokens:", refreshedTokens);

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error.response?.data || error.message);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export { handler as GET, handler as POST };
