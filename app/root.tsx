import { User } from "@prisma/client";
import {
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import { AuthProvider } from "./components/AuthData";
import NavBar from "./components/NavBar";
import styles from "./styles/app.css";
import { getUser } from "./utils/auth.server";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => {
  return { title: "Movie List" };
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  return user;
};

export default function App() {
  const user = useLoaderData<User | null>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <Links />
      </head>
      <body className="bg-black text-white font-inter">
        <AuthProvider user={user}>
          <NavBar />
          <Outlet />
        </AuthProvider>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
