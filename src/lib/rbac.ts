import { RoleKey } from "@prisma/client";
import { prisma } from "./prisma";

/**
 * Server-side permission check. Never trust client-side role hiding alone —
 * every protected server action / API route must call this.
 */
export async function userHasPermission(userId: string, permissionCode: string): Promise<boolean> {
  const roles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: { include: { permissions: { include: { permission: true } } } } }
  });

  return roles.some((ur) =>
    ur.role.permissions.some((rp) => rp.permission.code === permissionCode)
  );
}

export async function userHasRole(userId: string, role: RoleKey): Promise<boolean> {
  const count = await prisma.userRole.count({ where: { userId, role: { key: role } } });
  return count > 0;
}

export async function requirePermission(userId: string | undefined, permissionCode: string) {
  if (!userId) throw new Error("UNAUTHORIZED");
  const ok = await userHasPermission(userId, permissionCode);
  if (!ok) throw new Error("FORBIDDEN");
}
