import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/(models)/User";

import { NextAuthOptions } from "next-auth";
import { connect } from "@/app/lib/mongodb";
import bcrypt from "bcrypt"

connect();

// Define the expected user type with the necessary fields
interface UserType {
  _id: string;
  username: string;
  password: string;
  role: string;
  phone: string;
}

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text", placeholder: "Your phone number" },
        password: { label: "Password", type: "password", placeholder: "Your password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          console.log("No credentials provided");
          return null;
        }

        try {
          const foundUser = await User.findOne({ phone: credentials.phone })
            .lean()
            .exec() as UserType | null;

          if (foundUser) {
            console.log("User found:", foundUser);

            // Ensure that password exists before comparing
            const match = await bcrypt.compare(credentials.password || "", foundUser.password);

            if (match) {
              console.log("Password match successful");
              const { password, ...userWithoutPassword } = foundUser;
              return { id: foundUser._id.toString(), ...userWithoutPassword };
            } else {
              console.log("Password does not match");
            }
          } else {
            console.log("User not found");
          }
        } catch (error) {
          console.error("Error authorizing user:", error);
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.username = token.username as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
