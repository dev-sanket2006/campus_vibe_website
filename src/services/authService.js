import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// 🔹 Register User
export async function registerUser(
  name,
  email,
  password,
  role = "student",
  year,
  branch,
  section
) {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword, role, year, branch, section },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      year: true,
      branch: true,
      section: true,
    },
  });

  // If student → auto-assign to group
  if (role === "student" && year && branch && section) {
    let group = await prisma.group.findFirst({
      where: { year, branch, section },
    });

    if (!group) {
      group = await prisma.group.create({
        data: { year, branch, section },
      });
    }

    // Connect user to group
    await prisma.user.update({
      where: { id: newUser.id },
      data: {
        groups: {
          connect: { id: group.id },
        },
      },
    });
  }

  return newUser; // controller decides what to return
}

// 🔹 Login User
export async function loginUser(email, password) {
  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d", algorithm: "HS256" }
  );

  // Return safe user data
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      year: user.year,
      branch: user.branch,
      section: user.section,
    },
  };
}
