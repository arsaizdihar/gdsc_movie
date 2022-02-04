import { Request } from "@remix-run/node";
import { createCookie } from "remix";

export const jwtCookie = createCookie("jwt", {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  decode: (value: string) => value,
  encode: (value: string) => value,
});

export const getJwtCookie = async (request: Request) => {
  const cookie = request.headers.get("Cookie");
  const value = await jwtCookie.parse(cookie);
  return value;
};
