import React from "react";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  MetaFunction,
  redirect,
  useActionData,
} from "remix";
import { createUserSession, getUserId, register } from "~/utils/auth.server";
import { registerSchema, toErrorObject } from "~/utils/validators.server";

export const meta: MetaFunction = () => {
  return { title: "Register - Movie List" };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const validation = registerSchema.validate(Object.fromEntries(formData));
  if (validation.error) {
    return toErrorObject(validation.error);
  }
  const user = await register(validation.value);
  if (user) return await createUserSession(user.id, "/");
  return { email: "Email already in use." };
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/");
  }
  return {};
};

const Register = () => {
  const error =
    useActionData<{ email?: string; password?: string; name?: string }>();
  return (
    <main className="h-screen max-w-screen-xl flex items-center justify-center mx-auto">
      <Form
        method="post"
        className="flex flex-col bg-white p-4 w-full max-w-xs gap-y-2 text-black items-center"
        noValidate
      >
        <h1 className="font-medium text-2xl">Register here.</h1>
        <input
          type="text"
          name="name"
          autoComplete="name"
          className="border-2 border-black focus:outline-none focus:border-blue-700 px-3 py-1 rounded-sm w-full"
          placeholder="Name"
        />
        {error?.name && (
          <span className="italic text-sm text-red-500 self-start">
            {error.name}
          </span>
        )}
        <input
          type="email"
          name="email"
          className="border-2 border-black focus:outline-none focus:border-blue-700 px-3 py-1 rounded-sm w-full"
          placeholder="Email"
          autoComplete="email"
        />
        {error?.email && (
          <span className="italic text-sm text-red-500 self-start">
            {error.email}
          </span>
        )}
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          className="border-2 border-black focus:outline-none focus:border-blue-700 px-3 py-1 rounded-sm w-full"
          placeholder="Password"
        />
        {error?.password && (
          <span className="italic text-sm text-red-500 self-start">
            {error.password}
          </span>
        )}
        <button
          type="submit"
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-sm font-medium"
        >
          REGISTER
        </button>
      </Form>
    </main>
  );
};

export default Register;
