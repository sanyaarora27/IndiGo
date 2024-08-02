import axios from "axios";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { backend_url } from "../../config";

export const UpdateModal = ({ isOpen, onClose, data, setFlightData }) => {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [status, setStatus] = useState(data?.status || "On Time");

  const onSubmit = async (formData) => {
    let newData = {};
    if (formData.status === "On Time" || formData.status === "Cancelled") {
      newData = {
        status: formData.status,
        departure_gate: formData.departure_gate,
        arrival_gate: formData.arrival_gate,
      };
    } else {
      newData = {
        status: formData.status,
        departure_gate: formData.departure_gate,
        arrival_gate: formData.arrival_gate,
        scheduled_departure: formData.scheduled_departure,
        scheduled_arrival: formData.scheduled_arrival,
      };
    }

    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `${backend_url}/flight/update/${formData.flight_id}`,
        newData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.message) {
        toast.success("Flight details updated successfully");
        setFlightData((prevData) =>
          prevData.map((flight) =>
            flight.flight_id === formData.flight_id
              ? { ...flight, ...newData }
              : flight
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
    onClose();
  };

  const currentStatus = watch("status", "On Time");
  const isDisabled =
    currentStatus === "On Time" || currentStatus === "Cancelled";
  const isDisabledGate = currentStatus === "Cancelled";

  useEffect(() => {
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16);
    };

    if (data) {
      setValue("flight_id", data.flight_id);
      setValue("status", data.status || "On Time");
      setValue("departure_gate", data.departure_gate || "");
      setValue("arrival_gate", data.arrival_gate || "");
      setValue("scheduled_departure", formatDate(data.scheduled_departure));
      setValue("scheduled_arrival", formatDate(data.scheduled_arrival));
      setStatus(data.status || "On Time");
    }
  }, [data, setValue]);

  return (
    <div
      id="crud-modal"
      aria-hidden={!isOpen}
      className={`fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative rounded-lg shadow bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-600">
            <h3 className="text-lg font-semibold text-white">
              Update Flight Details
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-600 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={onClose}
            >
              <span className="sr-only">Close modal</span>
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-5">
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label
                  htmlFor="flight_id"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Flight ID
                </label>
                <input
                  disabled
                  type="text"
                  name="flight_id"
                  id="flight_id"
                  {...register("flight_id")}
                  className="bg-gray-600 border border-gray-500 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 opacity-50 cursor-not-allowed"
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="status"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  {...register("status")}
                  className="bg-gray-600 border border-gray-500 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                >
                  <option value="On Time">On Time</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="departure_gate"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Departure Gate
                </label>
                <input
                  disabled={isDisabledGate}
                  type="text"
                  name="departure_gate"
                  id="departure_gate"
                  {...register("departure_gate")}
                  className={`bg-gray-600 border border-gray-500 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 ${
                    isDisabledGate ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="arrival_gate"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Arrival Gate
                </label>
                <input
                  disabled={isDisabledGate}
                  type="text"
                  name="arrival_gate"
                  id="arrival_gate"
                  {...register("arrival_gate")}
                  className={`bg-gray-600 border border-gray-500 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 ${
                    isDisabledGate ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="scheduled_departure"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Scheduled Departure
                </label>
                <input
                  type="datetime-local"
                  name="scheduled_departure"
                  id="scheduled_departure"
                  {...register("scheduled_departure")}
                  disabled={isDisabled}
                  className={`bg-gray-600 border border-gray-500 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 ${
                    isDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="scheduled_arrival"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Scheduled Arrival
                </label>
                <input
                  type="datetime-local"
                  name="scheduled_arrival"
                  id="scheduled_arrival"
                  {...register("scheduled_arrival")}
                  disabled={isDisabled}
                  className={`bg-gray-600 border border-gray-500 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 ${
                    isDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>
            <button
              type="submit"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
