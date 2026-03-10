
import { FaSearch } from "react-icons/fa";

export default function FieldSearchSelector({ search, setSearch }) {
  return (
    <div className="p-2 w-full sm:w-1/5 border border-gray-600 dark:border-gray-200 rounded-lg mx-3 my-1">
    <div className="flex items-center relative">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search and select..."
        className="flex-1 border-none outline-none bg-transparent text-md w-full placeholder-gray-600 dark:placeholder-gray-200 text-black dark:text-white"
      />
      <FaSearch size={18} className="dark:text-white text-gray-600 ml-2" />
    </div>
  </div>
  
  );
}
