import classNames from "classnames";
import { Link } from "react-router-dom";
import { ActionFunction, LoaderFunction, redirect, useLoaderData } from "remix";
import Movie, { IMovie } from "~/components/Movie";
import { getUserId } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

type PageData = {
  movies: Array<IMovie>;
  page: number;
  totalPages: number;
  pageNumbers: Array<Number>;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const urlParams = new URLSearchParams(request.url.split("?")[1]);
  const page = parseInt(urlParams.get("page") || "1");
  if (isNaN(page)) {
    return redirect("/");
  }

  const movies = await db.movie.findMany({
    orderBy: { order: "asc" },
    skip: (page - 1) * 18,
    take: 18,
    select: {
      id: true,
      title: true,
      overview: true,
      backdropPath: true,
    },
  });
  const moviesCount = await db.movie.count();
  const userId = await getUserId(request);
  let wishlists: Array<{ id: string; movieId: Number }> = [];
  if (userId) {
    wishlists = await db.wishlist.findMany({
      where: { userId, movieId: { in: movies.map((m) => m.id) } },
      orderBy: { movie: { order: "asc" } },
      select: { id: true, movieId: true },
    });
  }

  if (movies.length === 0) {
    return redirect("/");
  }
  const totalPages = Math.ceil(moviesCount / 18);
  const pageNumbers = Array(5)
    .fill(0)
    .map((_, i) => page + i - 2)
    .filter((x) => x > 0 && x <= totalPages);
  const data: PageData = {
    movies: movies.map((m) => ({
      ...m,
      isWishlist: wishlists && !!wishlists?.find((w) => w.movieId === m.id),
    })),
    page,
    totalPages,
    pageNumbers,
  };
  return data;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  const movieId = Number(formData.get("movieId"));
  if (isNaN(movieId)) {
    return { error: true };
  }
  const userId = await getUserId(request);
  if (!userId) return;
  switch (action) {
    case "create":
      try {
        await db.wishlist.create({ data: { movieId, userId } });
        break;
      } catch (error) {
        return { error: true };
      }
    case "delete":
      try {
        await db.wishlist.delete({
          where: { userId_movieId: { movieId, userId } },
        });
      } catch (error) {
        return { error: true };
      }
      break;
    default:
      break;
  }
  return { success: true };
};

export default function Index() {
  const { movies, page, totalPages, pageNumbers } = useLoaderData<PageData>();
  return (
    <main className="pt-20 max-w-screen-xl mx-auto overflow-hidden px-4">
      <h1 className="text-center text-3xl font-medium tracking-wide mt-12">
        Popular Movie List
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
        {movies.map((movie) => (
          <Movie key={movie.id} {...movie} />
        ))}
      </div>
      <div className="flex justify-center mt-12 gap-x-2">
        {page !== 1 && (
          <Link
            to={`/?page=${page - 1}`}
            className="bg-red-900 inline-flex justify-center items-center font-bold w-8 h-8 rounded-md text-gray-300 hover:bg-red-800 duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
        )}
        {pageNumbers.map((x) => (
          <Link
            to={`/?page=${x}`}
            key={String(x)}
            className={classNames(
              "inline-flex justify-center items-center font-bold w-8 h-8 rounded-md text-gray-300 hover:bg-red-800 duration-200",
              x === page ? "bg-red-800" : "bg-red-900"
            )}
          >
            {x}
          </Link>
        ))}
        {page < totalPages && (
          <Link
            to={`/?page=${page + 1}`}
            className="bg-red-900 inline-flex justify-center items-center font-bold w-8 h-8 rounded-md text-gray-300 hover:bg-red-800 duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>
    </main>
  );
}
