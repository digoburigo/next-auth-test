import NextAuth, {
  type DefaultSession,
  type NextAuthConfig,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthConfig = {
  callbacks: {
    session: ({ session, token }) => {
      console.log(`token:`, token)
      console.log(`session:`, session)

      return ({
        ...session,
        user: {
          ...session.user,
        },
      })
    },
  },
  providers: [
    CredentialsProvider({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          let user = null;

          if (credentials.username === 'user' && credentials.password === '123456') {
            user = { id: 1, email: 'user@example.com', name: 'User' };
          }

          if (!user) {
            throw new Error("User not found.")
          }

          console.log(`user:`, user)

          return user;
        } catch (error) {
          return null
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

export const {
  handlers: { GET, POST },
  auth,
  signOut,
  signIn,
} = NextAuth(authOptions);
