import React from "react";
import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  MetaFunction,
  redirect,
  useActionData,
  useTransition,
} from "remix";
import { getNewJWTCookie, getUserId, login } from "~/utils/auth.server";
import { loginSchema } from "~/utils/validators.server";

export const meta: MetaFunction = () => {
  return { title: "Login - Movie List" };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData);
  const validation = loginSchema.validate({ email, password });
  if (validation.error) {
    return { error: true };
  }
  const user = await login(validation.value);
  if (!user) {
    return { error: true };
  } else {
    const cookie = await getNewJWTCookie(user);
    return redirect("/", { headers: { "Set-Cookie": cookie } });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/");
  }
  return {};
};

const Login = () => {
  const data = useActionData<{ error: boolean }>();
  const transition = useTransition();
  return (
    <main className="h-screen max-w-screen-xl flex items-center justify-center mx-auto">
      <Form
        method="post"
        className="flex flex-col bg-white p-4 w-full max-w-xs gap-y-2 text-black items-center"
        noValidate
      >
        <h1 className="font-medium text-2xl">Login here.</h1>
        <input
          type="email"
          name="email"
          className="border-2 border-black focus:outline-none focus:border-blue-700 px-3 py-1 rounded-sm w-full"
          placeholder="Email"
          autoComplete="email"
        />
        <input
          type="password"
          name="password"
          autoComplete="password"
          className="border-2 border-black focus:outline-none focus:border-blue-700 px-3 py-1 rounded-sm w-full"
          placeholder="Password"
        />
        {data?.error && (
          <span className="italic text-sm text-red-500 self-start">
            Invalid email or password
          </span>
        )}
        <p className="text-sm w-full">
          Doesn't have any account?{" "}
          <Link to="/register" className="font-bold hover:text-gray-700">
            Register here.
          </Link>
        </p>
        <button
          type="submit"
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-sm font-medium disabled:bg-gray-600"
          disabled={transition.state !== "idle"}
        >
          {transition.state === "idle" ? "Login" : "Loading..."}
        </button>
      </Form>
    </main>
  );
};

export default Login;
