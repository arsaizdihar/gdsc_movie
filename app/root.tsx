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
  useCatch,
  useLoaderData,
} from "remix";
import { AuthProvider } from "./components/AuthData";
import Footer from "./components/Footer";
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

const Document: React.FC<{ user: User | null }> = ({ children, user }) => {
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
      <body className="bg-black text-white font-inter flex flex-col min-h-screen">
        <AuthProvider user={user}>
          <NavBar />
          {children}
          <Footer />
        </AuthProvider>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
};

export default function App() {
  const user = useLoaderData<User | null>();

  return (
    <Document user={user}>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <Document user={null}>
      <main className="h-screen w-full flex justify-center items-center">
        <h1 className="text-white text-4xl font-medium">
          {caught.status} {caught.statusText}
        </h1>
      </main>
    </Document>
  );
}
