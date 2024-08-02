export const Loader = ({ size }) => {
  return (
    <div
      className={
        size == "sm"
          ? "border-gray-600 text-center h-5 w-5 animate-spin rounded-full border-4 border-t-white"
          : "border-gray-600 text-center h-10 w-10 animate-spin rounded-full border-4 border-t-white"
      }
    ></div>
  );
};
