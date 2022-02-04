import { PrismaClient } from "@prisma/client";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const db = new PrismaClient();

export async function seed() {
  let order = 1;
  for (let page = 1; page <= 20; page++) {
    const result = await axios.get(
      "https://api.themoviedb.org/3/movie/popular?api_key=" +
        process.env.MOVIE_API_KEY +
        "&page=" +
        page
    );
    const movies = result.data.results.map((movie: any) => ({
      title: movie.title,
      overview: movie.overview,
      id: movie.id,
      adult: movie.adult,
      popularity: movie.popularity,
      order: order++,
      releaseDate: new Date(movie.release_date),
      backdropPath: movie.backdrop_path,
      originalTitle: movie.original_title,
      originalLanguage: movie.original_language,
      voteCount: movie.vote_count,
      voteAverage: movie.vote_average,
    }));
    await db.movie.createMany({
      data: movies.filter(
        (movie: any) =>
          typeof movie.backdropPath === "string" &&
          movie.releaseDate.toString() !== "Invalid Date"
      ),
    });
    console.log(page);
    console.log(order);
  }
}
seed();
