import { Movie as IMovie, Movie } from "@prisma/client";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { LoaderFunction, redirect, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

type PageData = {
  movies: IMovie[];
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
  });
  const moviesCount = await db.movie.count();

  if (movies.length === 0) {
    return redirect("/");
  }
  const totalPages = Math.ceil(moviesCount / 18);
  const pageNumbers = Array(5)
    .fill(0)
    .map((_, i) => page + i - 2)
    .filter((x) => x > 0 && x <= totalPages);
  const data: PageData = {
    movies,
    page,
    totalPages,
    pageNumbers,
  };
  return data;
};

export default function Index() {
  const { movies, page, totalPages, pageNumbers } = useLoaderData<PageData>();
  return (
    <main className="pt-20 max-w-screen-xl mx-auto">
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

const Movie: React.FC<IMovie> = (props) => {
  return (
    <div className="bg-slate-800 h-full w-full px-4 py-3 rounded-md hover:scale-105 duration-200">
      <div className="flex flex-col justify-center h-16 mb-2">
        <h4 className="text-center font-medium text-xl line-clamp-2 tracking-wide">
          {props.title}
        </h4>
      </div>
      <img
        src={`https://image.tmdb.org/t/p/original${props.backdropPath}`}
        alt={props.title}
        className="w-full"
        loading="lazy"
      />
      <p className="line-clamp-3 m-2 text-gray-300">{props.overview}</p>
    </div>
  );
};
