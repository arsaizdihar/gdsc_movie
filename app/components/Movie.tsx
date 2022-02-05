import classNames from "classnames";
import React from "react";
import { Link } from "react-router-dom";
import { useFetcher } from "remix";
import { useMe } from "./AuthData";

export interface IMovie {
  id: number;
  title: string;
  overview: string;
  backdropPath: string;
  isWishlist: boolean;
}

const Movie: React.FC<IMovie> = (props) => {
  const user = useMe();
  const fetcher = useFetcher();
  const { submission } = fetcher;
  return (
    <div className="bg-slate-800 h-full w-full px-4 py-3 rounded-md sm:hover:scale-105 duration-200">
      <div className="flex flex-col justify-center h-16 mb-2">
        <h4 className="text-center font-medium text-xl line-clamp-2 tracking-wide">
          {props.title}
        </h4>
      </div>
      <img
        src={`https://image.tmdb.org/t/p/original${props.backdropPath}`}
        alt={props.title}
        className="w-full select-none"
        loading="lazy"
      />
      <p className="line-clamp-3 m-2 text-gray-300">{props.overview}</p>
      <fetcher.Form method="post" className="flex justify-center my-3">
        <input
          type="hidden"
          name="_action"
          value={props.isWishlist ? "delete" : "create"}
        />
        <input type="hidden" name="movieId" value={props.id} />
        <Link to={String(props.id)} className="px-2 py-1 bg-gray-500">
          More details
        </Link>
        {user && (
          <button
            className={classNames(
              "px-2 py-1 flex items-center font-medium rounded-md ml-4 duration-300",
              props.isWishlist
                ? "bg-red-600 disabled:bg-red-700"
                : "bg-green-600 disabled:bg-green-700"
            )}
            disabled={!!submission}
          >
            {props.isWishlist ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 inline-block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 inline-block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </>
            )}
          </button>
        )}
      </fetcher.Form>
    </div>
  );
};

export default Movie;
