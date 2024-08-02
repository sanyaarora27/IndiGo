import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getme } from "../utils/getme";
import { Table } from "../components/Table";
import { Loader } from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId, selectUserName, setUser } from "../redux/userSlice";
import { Appbar } from "../components/Appbar";
import { backend_url } from "../../config";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [flightData, setFlightData] = useState([]);
  const [isPageLoading, setPageLoading] = useState(true);
  const [subscriptionList, setSubscriptionList] = useState([]);
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const getFlight = async () => {
    const token = localStorage.getItem("token");
    const result = await axios.get(`${backend_url}/flight`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setFlightData(result.data);
  };

  const getSubscriptionList = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${backend_url}/flight/subscriptions/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.message) {
        setSubscriptionList(res.data.flightIds);
        setPageLoading(false);
      }
    } catch (error) {
      console.log(error);
      setPageLoading(false);
    }
  };

  const onClick = async (flightId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${backend_url}/flight/subscribe`,
        { user_id: userId, flight_id: flightId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.message) {
        setSubscriptionList([...subscriptionList, flightId]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = (await getme()).success;
      const data = (await getme()).data;
      if (!isAuthenticated) {
        navigate("/signin");
      } else {
        dispatch(
          setUser({
            userId: data.userId,
            userEmail: data.userEmail,
            userName: data.userName,
            userRole: data.userRole,
          })
        );
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    getFlight();
  }, []);

  useEffect(() => {
    if (userId) {
      getSubscriptionList();
    }
  }, [userId]);

  return isPageLoading ? (
    <div className="h-screen flex justify-center items-center bg-black">
      <Loader />
    </div>
  ) : (
    <div className="bg-black min-h-screen">
      <Appbar />
      <div className="p-10">
        <Table
          data={flightData}
          onClick={onClick}
          subscriptionList={subscriptionList}
          role="user"
        />
      </div>
    </div>
  );
};
