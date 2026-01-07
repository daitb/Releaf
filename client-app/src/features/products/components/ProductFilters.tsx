import { useState } from 'react';

export interface FilterOptions {
  categories?: string[];
  priceRange?: { min: number; max: number };
  materials?: string[];
  status?: string;
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  isOpen?: boolean;
}

export default function ProductFilters({ onFilterChange, isOpen = true }: ProductFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Mock data - replace with API call in production
  const categories = [
    'Đồ dùng nhà bếp',
    'Đồ gia dụng',
    'Thời trang',
    'Mỹ phẩm',
    'Văn phòng phẩm',
    'Đồ chơi'
  ];

  const materials = [
    'Tre',
    'Gỗ',
    'Cotton hữu cơ',
    'Giấy tái chế',
    'Nhựa sinh học',
    'Kim loại tái chế'
  ];

  const priceRanges = [
    { label: 'Dưới 100.000đ', min: 0, max: 100000 },
    { label: '100.000đ - 300.000đ', min: 100000, max: 300000 },
    { label: '300.000đ - 500.000đ', min: 300000, max: 500000 },
    { label: '500.000đ - 1.000.000đ', min: 500000, max: 1000000 },
    { label: 'Trên 1.000.000đ', min: 1000000, max: 10000000 }
  ];

  const handleCategoryToggle = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updated);
    applyFilters({ categories: updated });
  };

  const handleMaterialToggle = (material: string) => {
    const updated = selectedMaterials.includes(material)
      ? selectedMaterials.filter(m => m !== material)
      : [...selectedMaterials, material];
    setSelectedMaterials(updated);
    applyFilters({ materials: updated });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    applyFilters({ priceRange: { min, max } });
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    applyFilters({ status });
  };

  const applyFilters = (partialFilters: Partial<FilterOptions>) => {
    onFilterChange({
      categories: partialFilters.categories ?? selectedCategories,
      priceRange: partialFilters.priceRange ?? priceRange,
      materials: partialFilters.materials ?? selectedMaterials,
      status: partialFilters.status ?? selectedStatus
    });
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setPriceRange({ min: 0, max: 10000000 });
    setSelectedStatus('');
    onFilterChange({
      categories: [],
      priceRange: { min: 0, max: 10000000 },
      materials: [],
      status: ''
    });
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
    selectedMaterials.length > 0 || 
    selectedStatus !== '' ||
    (priceRange.min > 0 || priceRange.max < 10000000);

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all ${isOpen ? 'block' : 'hidden lg:block'}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-sm text-red-600 hover:text-red-700 font-medium transition"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      <div className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
        {/* Category Filter */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Danh mục</h4>
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-gray-700 group-hover:text-green-600 transition">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="border-t pt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Khoảng giá</h4>
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="priceRange"
                  checked={priceRange.min === range.min && priceRange.max === range.max}
                  onChange={() => handlePriceRangeChange(range.min, range.max)}
                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <span className="text-gray-700 group-hover:text-green-600 transition">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Material Filter */}
        <div className="border-t pt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Chất liệu</h4>
          <div className="space-y-2">
            {materials.map(material => (
              <label key={material} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes(material)}
                  onChange={() => handleMaterialToggle(material)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-gray-700 group-hover:text-green-600 transition">
                  {material}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="border-t pt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Tình trạng</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="status"
                checked={selectedStatus === ''}
                onChange={() => handleStatusChange('')}
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
              />
              <span className="text-gray-700 group-hover:text-green-600 transition">
                Tất cả
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="status"
                checked={selectedStatus === 'Available'}
                onChange={() => handleStatusChange('Available')}
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
              />
              <span className="text-gray-700 group-hover:text-green-600 transition">
                Còn hàng
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="status"
                checked={selectedStatus === 'Unavailable'}
                onChange={() => handleStatusChange('Unavailable')}
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
              />
              <span className="text-gray-700 group-hover:text-green-600 transition">
                Hết hàng
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="border-t p-4 bg-green-50">
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(cat => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
              >
                {cat}
                <button
                  onClick={() => handleCategoryToggle(cat)}
                  className="hover:text-green-900"
                >
                  ×
                </button>
              </span>
            ))}
            {selectedMaterials.map(mat => (
              <span
                key={mat}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
              >
                {mat}
                <button
                  onClick={() => handleMaterialToggle(mat)}
                  className="hover:text-green-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
