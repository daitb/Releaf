import { useState } from 'react';
import { ChevronDown, ChevronUp, X, Filter } from 'lucide-react';

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

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    priceRange: true,
    materials: true,
    status: true
  });

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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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

  const activeFilterCount = selectedCategories.length + selectedMaterials.length +
    (selectedStatus ? 1 : 0) + ((priceRange.min > 0 || priceRange.max < 10000000) ? 1 : 0);

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 border border-gray-100 ${isOpen ? 'block' : 'hidden lg:block'}`}>
      {/* Filter Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Bộ lọc</h3>
              {activeFilterCount > 0 && (
                <p className="text-green-50 text-sm">{activeFilterCount} bộ lọc đang áp dụng</p>
              )}
            </div>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl font-medium transition-all duration-300 hover:scale-105"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Xóa tất cả</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
        {/* Category Filter */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => toggleSection('categories')}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors duration-300"
          >
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">Danh mục</h4>
              {selectedCategories.length > 0 && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  {selectedCategories.length}
                </span>
              )}
            </div>
            {expandedSections.categories ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ${expandedSections.categories ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
          >
            <div className="px-5 pb-5 space-y-3">
              {categories.map(category => (
                <label
                  key={category}
                  className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-green-50 transition-colors duration-300"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-5 h-5 text-green-600 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all cursor-pointer"
                    />
                  </div>
                  <span className="text-gray-700 group-hover:text-green-600 transition-colors font-medium">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => toggleSection('priceRange')}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors duration-300"
          >
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">Khoảng giá</h4>
              {(priceRange.min > 0 || priceRange.max < 10000000) && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  1
                </span>
              )}
            </div>
            {expandedSections.priceRange ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ${expandedSections.priceRange ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
          >
            <div className="px-5 pb-5 space-y-3">
              {priceRanges.map((range, index) => (
                <label
                  key={index}
                  className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-green-50 transition-colors duration-300"
                >
                  <div className="relative">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange.min === range.min && priceRange.max === range.max}
                      onChange={() => handlePriceRangeChange(range.min, range.max)}
                      className="w-5 h-5 text-green-600 border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all cursor-pointer"
                    />
                  </div>
                  <span className="text-gray-700 group-hover:text-green-600 transition-colors font-medium">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Material Filter */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => toggleSection('materials')}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors duration-300"
          >
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">Chất liệu</h4>
              {selectedMaterials.length > 0 && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  {selectedMaterials.length}
                </span>
              )}
            </div>
            {expandedSections.materials ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ${expandedSections.materials ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
          >
            <div className="px-5 pb-5 space-y-3">
              {materials.map(material => (
                <label
                  key={material}
                  className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-green-50 transition-colors duration-300"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(material)}
                      onChange={() => handleMaterialToggle(material)}
                      className="w-5 h-5 text-green-600 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all cursor-pointer"
                    />
                  </div>
                  <span className="text-gray-700 group-hover:text-green-600 transition-colors font-medium">
                    {material}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <button
            onClick={() => toggleSection('status')}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors duration-300"
          >
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">Tình trạng</h4>
              {selectedStatus && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  1
                </span>
              )}
            </div>
            {expandedSections.status ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ${expandedSections.status ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
          >
            <div className="px-5 pb-5 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-green-50 transition-colors duration-300">
                <div className="relative">
                  <input
                    type="radio"
                    name="status"
                    checked={selectedStatus === ''}
                    onChange={() => handleStatusChange('')}
                    className="w-5 h-5 text-green-600 border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all cursor-pointer"
                  />
                </div>
                <span className="text-gray-700 group-hover:text-green-600 transition-colors font-medium">
                  Tất cả
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-green-50 transition-colors duration-300">
                <div className="relative">
                  <input
                    type="radio"
                    name="status"
                    checked={selectedStatus === 'Available'}
                    onChange={() => handleStatusChange('Available')}
                    className="w-5 h-5 text-green-600 border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-gray-700 group-hover:text-green-600 transition-colors font-medium">
                    Còn hàng
                  </span>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-green-50 transition-colors duration-300">
                <div className="relative">
                  <input
                    type="radio"
                    name="status"
                    checked={selectedStatus === 'Unavailable'}
                    onChange={() => handleStatusChange('Unavailable')}
                    className="w-5 h-5 text-green-600 border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-gray-700 group-hover:text-green-600 transition-colors font-medium">
                    Hết hàng
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="border-t border-gray-100 p-5 bg-gradient-to-br from-green-50 to-emerald-50">
          <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Đã chọn:</p>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(cat => (
              <span
                key={cat}
                className="group inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-green-200 text-green-700 text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                {cat}
                <button
                  onClick={() => handleCategoryToggle(cat)}
                  className="hover:bg-green-100 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${cat} filter`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {selectedMaterials.map(mat => (
              <span
                key={mat}
                className="group inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-green-200 text-green-700 text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                {mat}
                <button
                  onClick={() => handleMaterialToggle(mat)}
                  className="hover:bg-green-100 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${mat} filter`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
