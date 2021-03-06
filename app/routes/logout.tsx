import type { ActionFunction, LoaderFunction } from "remix";
import { redirect } from "remix";
import { logout } from "~/utils/auth.server";

export const action: ActionFunction = async ({ request }) => {
  return logout();
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
