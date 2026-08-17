import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signToken(adminId: string): string {
  return jwt.sign({ adminId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { adminId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { adminId: string };
  } catch {
    return null;
  }
}

export async function getAdminFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) return null;

  const admin = await prisma.admin.findUnique({ where: { id: payload.adminId } });
  return admin;
}
