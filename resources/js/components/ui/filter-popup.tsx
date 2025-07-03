import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface FilterPopupProps {
  onApplyFilters: (filters: any) => void;
}

export const FilterPopup: React.FC<FilterPopupProps> = ({ onApplyFilters }) => {
  const [priceRange, setPriceRange] = React.useState([0]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'tshirts', label: 'T-shirts' },
    { id: 'polo', label: 'Polo' },
    { id: 'jeans', label: 'Jeans' },
    { id: 'shirts', label: 'Shirts' },
  ];

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev => {
      if (category === 'all' && checked) {
        return ['all'];
      }
      
      const newCategories = checked
        ? [...prev.filter(c => c !== 'all'), category]
        : prev.filter(c => c !== category);
      
      return newCategories;
    });
  };

  const handleApplyFilter = () => {
    onApplyFilters({
      priceRange: priceRange[0],
      categories: selectedCategories,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M3 6h18" />
            <path d="M7 12h10" />
            <path d="M11 18h2" />
          </svg>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold">Filters</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div>
              <h4 className="text-sm font-semibold mb-6">Price</h4>
              <div className="space-y-4">
                <Slider
                  defaultValue={[0]}
                  max={300}
                  step={1}
                  onValueChange={setPriceRange}
                  className="w-full"
                />
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <span className="font-medium">{priceRange[0]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <span className="font-medium">300</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-6">Category</h4>
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked: boolean | "indeterminate") => handleCategoryChange(category.id, checked === true)}
                      className="h-5 w-5 rounded-[4px] border-gray-300"
                    />
                    <label
                      htmlFor={category.id}
                      className="text-sm font-medium leading-none"
                    >
                      {category.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t p-6 space-y-3">
            <Button onClick={handleApplyFilter} className="w-full h-12 text-base font-medium">
              Apply Filter
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 text-base font-medium" 
              onClick={() => {
                setPriceRange([0]);
                setSelectedCategories([]);
              }}
            >
              Clear all filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}; 