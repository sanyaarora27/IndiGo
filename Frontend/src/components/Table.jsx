import { format, parseISO } from "date-fns";
import { UpdateModal } from "./UpdateModal";
import { useState, useMemo } from "react";

export const Table = ({ data, onClick, subscriptionList, role, setFlightData }) => {
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleUpdateModal = (flight) => {
    setSelectedFlight(flight);
    setUpdateModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return format(parseISO(dateString), "MMM d, yyyy HH:mm");
  };

  const filteredData = useMemo(() => {
    return data.filter(
      (flight) =>
        flight.flight_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.airline.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  return (
    <div className="w-full">
      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Flight ID or Airline"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table for large screen */}
      <div
        className={
          isUpdateModalOpen
            ? "hidden md:block overflow-x-auto blur-sm"
            : "hidden md:block overflow-x-auto"
        }
      >
        <table className="w-full border-collapse bg-white min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Flight ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Airline
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Departure Gate
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Arrival Gate
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Scheduled Departure
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Actual Departure
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Scheduled Arrival
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Actual Arrival
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                {role === "user" ? "Email Alert" : "Action"}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((flight, index) => (
              <tr key={index}>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {flight.flight_id}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {flight.airline}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      flight.status === "Delayed"
                        ? "bg-yellow-100 text-yellow-800"
                        : flight.status === "On Time"
                        ? "bg-green-100 text-green-800"
                        : flight.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : ""
                    }`}
                  >
                    {flight.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {flight.departure_gate}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {flight.arrival_gate}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {formatDate(flight.scheduled_departure)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {flight.actual_departure
                    ? formatDate(flight.actual_departure)
                    : "N/A"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {formatDate(flight.scheduled_arrival)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {flight.actual_arrival
                    ? formatDate(flight.actual_arrival)
                    : "N/A"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {renderActionButton(flight, role)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* For Small Screen */}
      <div
        className={
          isUpdateModalOpen
            ? "md:hidden space-y-4 blur-sm"
            : "md:hidden space-y-4"
        }
      >
        {filteredData.map((flight, index) => (
          <div
            key={index}
            className="bg-white shadow overflow-hidden sm:rounded-lg"
          >
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Flight ID: {flight.flight_id}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Airline: {flight.airline}
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        flight.status === "Delayed"
                          ? "bg-yellow-100 text-yellow-800"
                          : flight.status === "On Time"
                          ? "bg-green-100 text-green-800"
                          : flight.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : ""
                      }`}
                    >
                      {flight.status}
                    </span>
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Departure Gate
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {flight.departure_gate}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Arrival Gate
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {flight.arrival_gate}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Scheduled Departure
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatDate(flight.scheduled_departure)}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Actual Departure
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {flight.actual_departure
                      ? formatDate(flight.actual_departure)
                      : "N/A"}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Scheduled Arrival
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatDate(flight.scheduled_arrival)}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Actual Arrival
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {flight.actual_arrival
                      ? formatDate(flight.actual_arrival)
                      : "N/A"}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    {role === "user" ? "Email Alert" : "Action"}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {renderActionButton(flight, role)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>

      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        data={selectedFlight}
        setFlightData={setFlightData}
      />
    </div>
  );

  function renderActionButton(flight, role) {
    if (role === "user") {
      return (
        <button
          disabled={subscriptionList.includes(flight.flight_id)}
          onClick={() => onClick(flight.flight_id)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            subscriptionList.includes(flight.flight_id)
              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {subscriptionList.includes(flight.flight_id)
            ? "Subscribed"
            : "Subscribe"}
        </button>
      );
    } else if (role === "admin") {
      return (
        <button
          onClick={() => handleUpdateModal(flight)}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          Update
        </button>
      );
    }
  }
};

Table.defaultProps = {
  data: [],
  onClick: () => {},
  setFlightData: () => {},
  subscriptionList: [],
  role: "user",
};