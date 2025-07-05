import { Skeleton } from "@/components/ui/skeleton"

export const PriceRangeSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Slider skeleton */}
      <div className="py-4">
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="flex justify-between mt-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </div>
      
      {/* Price display skeleton */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-6" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
      
      {/* Min/Max range skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  )
}

export const CategoriesSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3">
          <Skeleton className="h-5 w-5 rounded-[4px]" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  )
} 