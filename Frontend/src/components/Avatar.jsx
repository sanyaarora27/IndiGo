export const Avatar = ({ name }) => {
  return (
    <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-black rounded-full">
      <span className="font-medium text-gray-600 dark:text-gray-300">
        {name}
      </span>
    </div>
  );
};
