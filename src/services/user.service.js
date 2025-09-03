import prisma from "../config/db.js";

export async function getAll() {
  return await prisma.user.findMany();
}

export async function getById(id) {
  return await prisma.user.findUnique({ where: { id } });
}

export async function update(id, data) {
  return await prisma.user.update({ where: { id }, data });
}

export async function remove(id) {
  return await prisma.user.delete({ where: { id } });
}
