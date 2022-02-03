import React from "react";
import { ActionFunction, Form, MetaFunction } from "remix";
import { createUserSession, register } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
  return { title: "Register - Movie List" };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { name, email, password } = Object.fromEntries(formData);
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return { error: true };
  }
  const user = await register({ name, email, password });
  return await createUserSession(user.id, "/");
};

const Register = () => {
  return (
    <main className="h-screen max-w-screen-xl flex items-center justify-center mx-auto">
      <Form
        method="post"
        className="flex flex-col bg-white p-4 w-full max-w-xs gap-y-2 text-black items-center"
      >
        <h1 className="font-medium text-2xl">Register here.</h1>
        <input
          type="text"
          name="name"
          autoComplete="name"
          className="border-2 border-black focus:outline-none focus:border-blue-700 px-3 py-1 rounded-sm w-full"
          placeholder="Name"
        />
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
          autoComplete="new-password"
          className="border-2 border-black focus:outline-none focus:border-blue-700 px-3 py-1 rounded-sm w-full"
          placeholder="Password"
        />
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
