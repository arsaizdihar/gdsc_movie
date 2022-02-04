import { Movie as IMovie, Movie } from "@prisma/client";
import { LoaderFunction, redirect, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

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
  });
  if (movies.length === 0) {
    return redirect("/");
  }
  return movies;
};

export default function Index() {
  const movies = useLoaderData<Array<Movie>>();
  return (
    <main className="pt-20 max-w-screen-xl mx-auto">
      <h1 className="text-center text-3xl font-medium tracking-wide">
        Popular Movie List
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
        {movies.map((movie) => (
          <Movie key={movie.id} {...movie} />
        ))}
      </div>
    </main>
  );
}

const Movie: React.FC<IMovie> = (props) => {
  return (
    <div className="bg-slate-800 h-full w-full px-4 py-3 rounded-md hover:scale-105 duration-200">
      <div className="flex flex-col justify-center h-16 mb-2">
        <h4 className="text-center font-medium text-xl line-clamp-2">
          {props.title}
        </h4>
      </div>
      <img
        src={`https://image.tmdb.org/t/p/original${props.backdropPath}`}
        alt={props.title}
        className="w-full"
        loading="lazy"
      />
    </div>
  );
};
