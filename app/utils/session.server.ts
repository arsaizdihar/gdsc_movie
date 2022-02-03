import { createCookieSessionStorage } from "remix";

const secret = process.env.SESSION_SECRET;
if (typeof secret !== "string") {
  throw new Error("SESSION_SECRET environment variable is not set");
}

export const storage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [secret],
    secure: process.env.NODE_ENV === "production",
  },
});
