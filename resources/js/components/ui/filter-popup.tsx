import React from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { Loader2, AlertCircle } from "lucide-react";

interface FilterPopupProps {
  onApplyFilters: (filters: any) => void;
  onClearFilters: () => void;
  initialFilters?: {
    priceRange?: number;
    categories?: string[];
  };
}

export const FilterPopup: React.FC<FilterPopupProps> = ({ 
  onApplyFilters, 
  onClearFilters, 
  initialFilters 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [priceRange, setPriceRange] = React.useState([initialFilters?.priceRange || 0]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(initialFilters?.categories || []);
  const { categories, loading: categoriesLoading, error: categoriesError, refetch } = useCategories();

  // Update internal state when initial filters change
  React.useEffect(() => {
    setPriceRange([initialFilters?.priceRange || 0]);
    setSelectedCategories(initialFilters?.categories || []);
  }, [initialFilters]);

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
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setPriceRange([0]);
    setSelectedCategories([]);
    onClearFilters();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="p-2 hover:bg-gray-100 rounded-full md:rounded-lg absolute bg-gray-100 md:bg-white px-2 py-2 md:px-6 md:py-6">
        <svg className='w-6 h-6 md:w-12 md:h-12' viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M32.5832 27.6322C32.5832 27.9223 32.4679 28.2005 32.2628 28.4056C32.0577 28.6108 31.7795 28.726 31.4894 28.726H24.0519C23.8083 29.6344 23.2718 30.437 22.5257 31.0094C21.7795 31.5818 20.8653 31.8921 19.9248 31.8921C18.9844 31.8921 18.0702 31.5818 17.324 31.0094C16.5778 30.437 16.0414 29.6344 15.7978 28.726H4.51025C4.22017 28.726 3.94197 28.6108 3.73686 28.4056C3.53174 28.2005 3.4165 27.9223 3.4165 27.6322C3.4165 27.3422 3.53174 27.064 3.73686 26.8588C3.94197 26.6537 4.22017 26.5385 4.51025 26.5385H15.7978C16.0414 25.6301 16.5778 24.8275 17.324 24.2551C18.0702 23.6826 18.9844 23.3724 19.9248 23.3724C20.8653 23.3724 21.7795 23.6826 22.5257 24.2551C23.2718 24.8275 23.8083 25.6301 24.0519 26.5385H31.4894C31.7795 26.5385 32.0577 26.6537 32.2628 26.8588C32.4679 27.064 32.5832 27.3422 32.5832 27.6322ZM32.5832 8.36766C32.5832 8.65774 32.4679 8.93594 32.2628 9.14106C32.0577 9.34617 31.7795 9.46141 31.4894 9.46141H27.9165C27.6729 10.3698 27.1364 11.1724 26.3902 11.7448C25.6441 12.3173 24.7299 12.6275 23.7894 12.6275C22.849 12.6275 21.9348 12.3173 21.1886 11.7448C20.4424 11.1724 19.9059 10.3698 19.6623 9.46141H4.51025C4.36662 9.46141 4.22439 9.43312 4.09169 9.37815C3.95899 9.32318 3.83842 9.24262 3.73686 9.14106C3.63529 9.03949 3.55473 8.91892 3.49976 8.78622C3.44479 8.65352 3.4165 8.51129 3.4165 8.36766C3.4165 8.22402 3.44479 8.0818 3.49976 7.9491C3.55473 7.8164 3.63529 7.69582 3.73686 7.59426C3.83842 7.4927 3.95899 7.41213 4.09169 7.35716C4.22439 7.3022 4.36662 7.27391 4.51025 7.27391H19.6623C19.9059 6.36555 20.4424 5.56293 21.1886 4.99049C21.9348 4.41806 22.849 4.10779 23.7894 4.10779C24.7299 4.10779 25.6441 4.41806 26.3902 4.99049C27.1364 5.56293 27.6729 6.36555 27.9165 7.27391H31.4894C31.6336 7.27195 31.7767 7.2989 31.9103 7.35317C32.0439 7.40744 32.1652 7.48793 32.2672 7.58989C32.3691 7.69185 32.4496 7.8132 32.5039 7.94679C32.5582 8.08037 32.5851 8.22348 32.5832 8.36766ZM32.5832 17.9927C32.5851 18.1368 32.5582 18.2799 32.5039 18.4135C32.4496 18.5471 32.3691 18.6685 32.2672 18.7704C32.1652 18.8724 32.0439 18.9529 31.9103 19.0071C31.7767 19.0614 31.6336 19.0884 31.4894 19.0864H14.4269C14.1833 19.9948 13.6468 20.7974 12.9007 21.3698C12.1545 21.9423 11.2403 22.2525 10.2998 22.2525C9.35938 22.2525 8.44519 21.9423 7.69901 21.3698C6.95284 20.7974 6.41636 19.9948 6.17275 19.0864H4.51025C4.22017 19.0864 3.94197 18.9712 3.73686 18.7661C3.53174 18.5609 3.4165 18.2827 3.4165 17.9927C3.4165 17.7026 3.53174 17.4244 3.73686 17.2193C3.94197 17.0141 4.22017 16.8989 4.51025 16.8989H6.17275C6.41636 15.9905 6.95284 15.1879 7.69901 14.6155C8.44519 14.0431 9.35938 13.7328 10.2998 13.7328C11.2403 13.7328 12.1545 14.0431 12.9007 14.6155C13.6468 15.1879 14.1833 15.9905 14.4269 16.8989H31.4894C31.7795 16.8989 32.0577 17.0141 32.2628 17.2193C32.4679 17.4244 32.5832 17.7026 32.5832 17.9927Z" fill="black"/>
</svg>

        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="text-xl font-semibold">Filters</SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
              
            </SheetDescription>
          </SheetHeader>
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
                {categoriesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">Loading categories...</span>
                  </div>
                ) : categoriesError ? (
                  <div className="space-y-3">
                    <div className="flex items-center text-amber-600">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span className="text-sm">Failed to load categories</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => refetch()}
                      className="w-full"
                    >
                      Try Again
                    </Button>
                    <div className="text-xs text-gray-500 text-center">
                      Using default categories
                    </div>
                  </div>
                ) : null}
                
                {!categoriesLoading && categories.map((category) => (
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
              onClick={handleClearFilters}
            >
              Clear all filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}; 