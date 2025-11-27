import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Tìm kiếm sản phẩm...', initialValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-5 py-3 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-green-600 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  );
}
