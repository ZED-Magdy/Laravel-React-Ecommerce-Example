import { Skeleton } from "@/components/ui/skeleton"

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      {/* Product Image Skeleton */}
      <div className="aspect-square bg-gray-100 relative">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      
      {/* Product Info Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title Skeleton */}
        <Skeleton className="h-5 w-3/4" />
        
        {/* Price Skeleton */}
        <Skeleton className="h-6 w-1/3" />
        
        {/* Stock Status Skeleton */}
        <Skeleton className="h-4 w-1/2" />
        
        {/* Add to Cart Button Skeleton */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    </div>
  )
} 