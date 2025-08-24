import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "@/lib/mongodb"
import User, { IUser } from "@/models/User"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) return null

        try {
          await dbConnect()
          const user = await User.findOne({ email: credentials.email }).select(
            "+password", // ✅ explicitly request password
          ) as IUser | null

          if (!user) return null

          const isPasswordValid = await user.comparePassword(credentials.password)
          if (!isPasswordValid) return null

          return {
            id: user._id.toString(), // ✅ safe now
            email: user.email,
            name: user.name,
            role: user.role, // ✅ enforced by schema
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role // ✅ safe, since schema enforces
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as "admin" | "user"
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
