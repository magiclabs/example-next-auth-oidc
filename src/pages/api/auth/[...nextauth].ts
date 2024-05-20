import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          scope: 'openid profile email',
          session: {
            strategy: 'jwt',
          },
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Store the id_token in the token object
      if (account) {
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the id_token to the session object
      session.idToken = token.idToken;
      return session;
    },
  },
});
