import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";
import { db } from "@/src/index";
import {
  sys_usersTable,
  sys_userRoleTable,
  sys_roleTable,
  sys_roleMenuTable,
  sys_menuTable,
} from "@/src/db/schema";
import { eq, and, inArray, or, isNull } from "drizzle-orm";

/**
 * Query user from sys_user table by user_name.
 */
async function getUser(userName: string) {
  try {
    const result = await db
      .select()
      .from(sys_usersTable)
      .where(
        and(
          eq(sys_usersTable.user_name, userName),
          eq(sys_usersTable.del_flag, "0"),
          eq(sys_usersTable.status, "0"),
        ),
      );
    return result[0] ?? null;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

/**
 * Fetch role keys for a user via sys_user_role → sys_role.
 */
async function getUserRoles(userId: number): Promise<string[]> {
  const result = await db
    .select({ key: sys_roleTable.key })
    .from(sys_userRoleTable)
    .innerJoin(sys_roleTable, eq(sys_userRoleTable.role_id, sys_roleTable.id))
    .where(
      and(
        eq(sys_userRoleTable.user_id, userId),
        eq(sys_roleTable.del_flag, "0"),
        eq(sys_roleTable.status, 1),
      ),
    );
  return result.map((r) => r.key);
}

/**
 * Fetch permission strings for a user via sys_user_role → sys_role_menu → sys_menu(perms).
 */
async function getUserPermissions(userId: number): Promise<string[]> {
  // 1. Get role IDs for this user
  const roleRows = await db
    .select({ roleId: sys_userRoleTable.role_id })
    .from(sys_userRoleTable)
    .where(eq(sys_userRoleTable.user_id, userId));
  const roleIds = roleRows.map((r) => r.roleId);
  if (roleIds.length === 0) return [];

  // 2. Get menu IDs linked to those roles
  const menuRows = await db
    .select({ menuId: sys_roleMenuTable.menu_id })
    .from(sys_roleMenuTable)
    .where(inArray(sys_roleMenuTable.role_id, roleIds));
  const menuIds = menuRows.map((r) => r.menuId);
  if (menuIds.length === 0) return [];

  // 3. Get permission strings from those menus
  const menus = await db
    .select({ perms: sys_menuTable.perms })
    .from(sys_menuTable)
    .where(
      and(
        inArray(sys_menuTable.id, menuIds),
        or(isNull(sys_menuTable.del_flag), eq(sys_menuTable.del_flag, "0")),
        eq(sys_menuTable.status, 0),
      ),
    );

  return menus.map((m) => m.perms).filter((p): p is string => !!p);
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            userName: z.string().min(1),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { userName, password } = parsedCredentials.data;
        const user = await getUser(userName);
        if (!user) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        // Return minimal user object — jwt callback will fetch roles & permissions
        return { id: String(user.user_id) };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On initial sign-in, cache userId + roles + permissions in the token
      if (user) {
        const userId = Number(user.id);
        token.userId = userId;
        token.roles = await getUserRoles(userId);
        token.permissions = await getUserPermissions(userId);
      }

      // On session update (e.g. after role changes), refresh from DB
      if (trigger === "update" && token.userId) {
        token.roles = await getUserRoles(token.userId as number);
        token.permissions = await getUserPermissions(token.userId as number);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.userId = token.userId as number;
        session.user.roles = (token.roles as string[]) ?? [];
        session.user.permissions = (token.permissions as string[]) ?? [];
      }
      return session;
    },
  },
});
