import { ActionFunction, LoaderFunction, redirect, useLoaderData } from "remix";
import Movie, { IMovie } from "~/components/Movie";
import { getUserId } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    return redirect("/login?redirectTo=/wishlist");
  }
  const movies = await db.movie.findMany({
    where: { wishlists: { some: { userId } } },
    select: {
      id: true,
      title: true,
      overview: true,
      backdropPath: true,
    },
  });
  return movies;
};
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const movieId = Number(formData.get("movieId"));
  if (isNaN(movieId)) {
    return { error: true };
  }
  const userId = await getUserId(request);
  if (!userId) return;

  try {
    await db.wishlist.delete({
      where: { userId_movieId: { movieId, userId } },
    });
  } catch (error) {
    return { error: true };
  }
  return { success: true };
};

export default function Wishlist() {
  const movies = useLoaderData<IMovie[]>();
  return (
    <main className="pt-20 max-w-screen-xl mx-auto overflow-hidden px-4">
      <h1 className="text-center text-3xl font-medium tracking-wide mt-12">
        Your Movie Wishlist
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
        {movies.map((movie) => (
          <Movie key={movie.id} {...movie} isWishlist />
        ))}
      </div>
    </main>
  );
}
