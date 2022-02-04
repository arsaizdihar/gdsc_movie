import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import cookieLib from "cookie";
import jwt from "jsonwebtoken";
import { redirect } from "remix";
import { jwtCookie } from "./cookie.server";
import { db } from "./db.server";

type LoginForm = {
  email: string;
  password: string;
};

type RegisterForm = LoginForm & {
  name: string;
};

export async function register({ name, email, password }: RegisterForm) {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function login({ email, password }: LoginForm) {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return null;
  }
  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    return null;
  }
  return user;
}

export async function getUserId(request: Request) {
  const cookie = request.headers.get("Cookie");

  const token = await jwtCookie.parse(cookie);
  if (typeof token !== "string") {
    return null;
  }

  const decoded = extractJWT(token);
  if (decoded === null) {
    return null;
  }
  return decoded.id as string;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = getUserId(request);
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (!userId) {
    return null;
  }
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });
    return user;
  } catch {
    throw logout();
  }
}

export async function logout() {
  return redirect("/login", {
    headers: {
      "Set-Cookie": cookieLib.serialize(jwtCookie.name, "", {
        expires: new Date(0),
      }),
    },
  });
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

export const getNewJWTCookie = async (user: User) => {
  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
  return await jwtCookie.serialize(token);
};

export const extractJWT = (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET);
  if (typeof decoded === "object") {
    return decoded;
  }
  return null;
};
