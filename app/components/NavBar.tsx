import classNames from "classnames";
import { Form, NavLink } from "remix";
import { useMe } from "./AuthData";
const NavBar = ({ wishlistCount = 0 }: { wishlistCount?: number }) => {
  const user = useMe();

  return (
    <div className="shadow-gray-800 shadow-sm fixed inset-x-0 bg-black z-50">
      <nav className="flex justify-between p-4 gap-x-4 max-w-screen-xl mx-auto items-center">
        <NavLink
          to={"/"}
          className={({ isActive }) =>
            classNames(
              "font-bold tracking-widest text-xl border-b-4 hover:text-gray-200",
              isActive && "border-red-900",
              !isActive && "border-transparent"
            )
          }
        >
          MOVIE
        </NavLink>
        <div className="flex">
          {user ? (
            <>
              <NavLink
                to={"/wishlist"}
                className={({ isActive }) =>
                  classNames(
                    isActive && "text-white bg-gray-800",
                    "py-2 px-4 rounded-sm hover:bg-gray-800 font-medium"
                  )
                }
              >
                Wishlist{" "}
                {wishlistCount > 0 && (
                  <span className="bg-yellow-500 rounded-full px-2 py-1 text-black">
                    {wishlistCount}
                  </span>
                )}
              </NavLink>
              <Form action="/logout" method="post">
                <button
                  type="submit"
                  className="py-2 px-4 rounded-sm hover:bg-gray-800 font-medium"
                >
                  Logout
                </button>
              </Form>
            </>
          ) : (
            <>
              <NavLink
                to={"/login"}
                className={({ isActive }) =>
                  classNames(
                    isActive && "text-white bg-gray-800",
                    "py-2 px-4 rounded-sm hover:bg-gray-800 font-medium"
                  )
                }
              >
                Login
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
