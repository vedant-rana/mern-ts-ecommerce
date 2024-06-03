import { useState } from "react";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const user = {
  _id: "12",
  role: "admin",
};
const Header = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const logOutHandler = () => {
    setIsDialogOpen(false);
  };

  return (
    <nav className="header">
      <Link onClick={() => setIsDialogOpen(false)} to={"/"}>
        Home
      </Link>
      <Link onClick={() => setIsDialogOpen(false)} to={"/search"}>
        <FaSearch />
      </Link>
      <Link onClick={() => setIsDialogOpen(false)} to={"/cart"}>
        <FaShoppingBag />
      </Link>
      {user._id ? (
        <>
          <button onClick={() => setIsDialogOpen((prev) => !prev)}>
            <FaUser />
          </button>
          <dialog open={isDialogOpen}>
            <div>
              {user.role === "admin" && (
                <Link
                  onClick={() => setIsDialogOpen(false)}
                  to="/admin/dashboard"
                >
                  Admin
                </Link>
              )}

              <Link onClick={() => setIsDialogOpen(false)} to="/orders">
                Orders
              </Link>
              <button onClick={logOutHandler}>
                <FaSignOutAlt />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link onClick={() => setIsDialogOpen(false)} to={"/login"}>
          <FaSignInAlt />
        </Link>
      )}
    </nav>
  );
};

export default Header;
