import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { IUser } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

// const user = {
//   _id: "",
//   role: "",
// };

interface HeaderPropType {
  user: IUser | null;
}

const Header = ({ user }: HeaderPropType) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const logOutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out Successfully");
      setIsDialogOpen(false);
    } catch (err) {
      toast.error("Log out Failed");
    }
  };

  return (
    <nav className="header">
      <Link onClick={() => setIsDialogOpen(false)} to={"/"}>
        HOME
      </Link>
      <Link onClick={() => setIsDialogOpen(false)} to={"/search"}>
        <FaSearch />
      </Link>
      <Link onClick={() => setIsDialogOpen(false)} to={"/cart"}>
        <FaShoppingBag />
      </Link>
      {user?._id ? (
        <>
          <button onClick={() => setIsDialogOpen((prev) => !prev)}>
            <FaUser />
          </button>
          <dialog open={isDialogOpen} style={{ zIndex: 10 }}>
            <div>
              {user?.role === "admin" && (
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
