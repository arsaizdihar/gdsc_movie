import classNames from "classnames";
import { Form, NavLink } from "remix";
import { useMe } from "./AuthData";
const NavBar = () => {
  const user = useMe();

  return (
    <nav className="flex justify-center p-2 gap-x-4 fixed inset-x-0 shadow-gray-800 shadow-sm">
      {user ? (
        <Form action="/logout" method="post">
          <button type="submit" className="button">
            Logout
          </button>
        </Form>
      ) : (
        <>
          <NavLink
            to={"/login"}
            className={({ isActive }) =>
              classNames(
                isActive && "text-white bg-gray-800",
                "px-2 py-1 rounded-sm"
              )
            }
          >
            Login
          </NavLink>
          <NavLink
            to={"/register"}
            className={({ isActive }) =>
              classNames(isActive && "bg-gray-800", "px-2 py-1 rounded-sm")
            }
          >
            Register
          </NavLink>
        </>
      )}
    </nav>
  );
};

export default NavBar;
