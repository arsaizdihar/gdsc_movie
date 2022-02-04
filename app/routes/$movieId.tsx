import { Movie } from "@prisma/client";
import React from "react";
import { LoaderFunction, useLoaderData } from "remix";
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

const MoviePage = () => {
  const { movie, isWishlist } = useLoaderData<PageData>();
  return (
    <main className="pt-24 max-w-screen-xl mx-auto flex flex-col items-center">
      <img
        src={`https://image.tmdb.org/t/p/original${movie.backdropPath}`}
        alt={movie.title}
      />
      <h1 className="text-center text-4xl font-medium">{movie.title}</h1>
      <p className="max-w-screen-sm">{movie.overview}</p>
    </main>
  );
};

export default MoviePage;
