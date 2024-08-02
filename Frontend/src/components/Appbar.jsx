import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar } from "./Avatar";
import { selectUserName } from "../redux/userSlice";
import { ProfilePopUp } from "./ProfilePopUp";

export const Appbar = () => {
  const [popUpFlag, setPopUpFlag] = useState(false);
  const divRef = useRef();
  const name = useSelector(selectUserName);

  const handlePopUp = () => {
    setPopUpFlag(!popUpFlag);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setPopUpFlag(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-600 flex justify-between items-center py-2 px-4">
      <div className="text-xl text-white font-semibold">
        Real Time Flight Update
      </div>
      <div ref={divRef} className="relative">
        <button type="button" onClick={handlePopUp}>
          <Avatar name={name ? name.slice(0, 1) : "U"} />
        </button>
        {popUpFlag && (
          <div className="absolute right-0 mt-2">
            <ProfilePopUp closePopUp={setPopUpFlag} />
          </div>
        )}
      </div>
    </div>
  );
};
