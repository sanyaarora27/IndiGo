import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearUser,
  selectUserEmail,
  selectUserName,
  selectUserRole,
} from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

export const ProfilePopUp = ({ closePopUp, parentRef }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const name = useSelector(selectUserName);
  const email = useSelector(selectUserEmail);
  const role = useSelector(selectUserRole);

  const popUpRef = useRef(null);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
    navigate("/signin");
  };

  const handleClickOutside = (event) => {
    if (parentRef.current && parentRef.current.contains(event.target)) {
      return;
    } else if (popUpRef.current && !popUpRef.current.contains(event.target)) {
      closePopUp();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={popUpRef}
      className="absolute right-10 z-10 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
    >
      <div className="p-4 border-b border-gray-200">
        <p className="text-lg font-semibold text-gray-800">
          {name}{" "}
          {role === "admin" && (
            <span className="text-sm font-normal text-blue-600 ml-1">
              (Admin)
            </span>
          )}
        </p>
        <p className="text-sm text-gray-600 mt-1">{email}</p>
      </div>
      <div className="py-1" role="none">
        <button
          onClick={handleSignOut}
          type="button"
          className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition duration-150 ease-in-out"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};
