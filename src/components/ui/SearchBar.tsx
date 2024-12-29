import { FC } from 'react';
import { RiSearchLine } from 'react-icons/ri';

const SearchBar: FC = () => {
  return (
    <div className="relative flex-1 max-w-2xl">
      <input
        type="text"
        placeholder="Search RFQ..."
        className="w-full px-4 py-2 pl-10 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
    </div>
  );
};

export default SearchBar;