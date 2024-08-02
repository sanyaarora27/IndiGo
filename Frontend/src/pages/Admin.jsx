import { useEffect, useState } from "react";
import { Loader } from "../components/Loader";
import { Appbar } from "../components/Appbar";
import { Table } from "../components/Table";
import axios from "axios";
import { getme } from "../utils/getme";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { backend_url } from "../../config";

export const Admin = () => {
  const [isPageLoading, setPageLoading] = useState(true);
  const [flightData, setFlightData] = useState([]);
  const [isUserLoaded, setUserLoaded] = useState(false); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user); 

  useEffect(() => {
    const checkAuth = async () => {
      const response = await getme();
      if (!response.success) {
        navigate("/signin");
      } else {
        const data = response.data;
        if (data.userRole !== "admin") {
          navigate("/unauthorized");
        } else {
          dispatch(setUser(data));
          setUserLoaded(true); 
        }
      }
    };
    checkAuth();
  }, [dispatch, navigate]);

  useEffect(() => {
    const getFlight = async () => {
      const token = localStorage.getItem("token");
      try {
        const result = await axios.get(`${backend_url}/flight`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFlightData(result.data);
      } catch (error) {
        console.error("Error fetching flight data:", error);
      } finally {
        setPageLoading(false);
      }
    };
    getFlight();
  }, []);

  if (isPageLoading || !isUserLoaded) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <Appbar user={user} />
      <div className="p-10">
        <Table data={flightData} role="admin" setFlightData={setFlightData} />
      </div>
    </div>
  );
};
