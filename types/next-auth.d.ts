import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userId: number;
      roles: string[];
      permissions: string[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth" {
  interface JWT extends DefaultJWT {
    userId: number;
    roles: string[];
    permissions: string[];
  }
}
