import { Movie } from "@prisma/client";
import classNames from "classnames";
import React from "react";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useLoaderData,
  useTransition,
} from "remix";
import { getUserId } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

type PageData = {
  movie: Movie;
  isWishlist: boolean;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const movieId = Number(params.movieId);
  if (isNaN(movieId)) {
    throw new Response("Not Found", { status: 404 });
  }
  const userId = await getUserId(request);
  const movie = await db.movie.findUnique({ where: { id: movieId } });
  if (!movie) {
    throw new Response("Not Found", { status: 404 });
  }
  let isWishlist = false;
  if (userId) {
    const wishlist = await db.wishlist.findUnique({
      where: { userId_movieId: { movieId, userId } },
      select: { id: true },
    });
    isWishlist = !!wishlist;
  }
  const res: PageData = { movie, isWishlist };
  return res;
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  const movieId = Number(params.movieId);
  if (isNaN(movieId)) {
    return { error: true };
  }
  const userId = await getUserId(request);
  if (!userId) {
    return redirect("/login?redirectTo=/" + movieId);
  }

  if (action === "create") {
    try {
      await db.wishlist.create({ data: { movieId, userId } });
      return { success: true };
    } catch (error) {
      return { error: true };
    }
  }

  if (action === "delete") {
    try {
      await db.wishlist.delete({
        where: { userId_movieId: { movieId, userId } },
      });
      return { success: true };
    } catch (error) {
      return { error: true };
    }
  }
  return { error: true };
};

const MoviePage = () => {
  const { movie, isWishlist } = useLoaderData<PageData>();
  const transition = useTransition();
  return (
    <main className="pt-24 max-w-screen-xl mx-auto flex flex-col items-center px-4 flex-grow">
      <div className="border-2 border-gray-800 rounded-md overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdropPath}`}
          alt={movie.title}
          className=""
        />
        <h1 className="text-center text-2xl md:text-4xl font-medium p-2">
          {movie.title} -{" "}
          <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
        </h1>
        <div className="flex justify-center">
          <span
            className={classNames(
              "px-2 py-1 rounded-md font-medium",
              movie.voteAverage < 5
                ? "bg-red-600"
                : movie.voteAverage < 7
                ? "bg-yellow-600"
                : "bg-green-600"
            )}
          >
            {movie.voteAverage.toFixed(2)}
          </span>
        </div>
        <p className="max-w-screen-sm px-2 text-justify mx-auto my-4">
          {movie.overview}
        </p>
        <Form method="post" className="mb-4">
          <input
            type="hidden"
            name="_action"
            value={isWishlist ? "delete" : "create"}
          />
          <button
            className={classNames(
              "block mx-auto px-3 py-2 rounded-md font-medium duration-300 uppercase text-gray-100 disabled:text-gray-300",
              isWishlist
                ? "bg-red-600 hover:bg-red-500 disabled:bg-red-700"
                : "bg-green-600 hover:bg-green-500 disabled:bg-green-700"
            )}
            disabled={transition.state === "submitting"}
          >
            {isWishlist ? "Remove from wishlist" : "Add to wishlist"}
          </button>
        </Form>
      </div>
    </main>
  );
};

export default MoviePage;
