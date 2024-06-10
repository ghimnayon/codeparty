import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "kakao") {
        return profile.id !== null;
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.name = profile.properties?.nickname;
        token.profileImage = profile.properties?.profile_image;
        console.log("JWT Callback - token:", token); // 로그 추가
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          name: token.name,
          profileImage: token.profileImage,
        };
        console.log("Session Callback - session.user:", session.user); // 로그 추가
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
