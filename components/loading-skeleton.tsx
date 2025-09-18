import type { FC } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export interface LoadingSkeletonProps {
  count?: number
  className?: string
}

const LoadingSkeleton: FC<LoadingSkeletonProps> = ({ count = 3, className }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="w-full">
          <CardContent className="p-6 space-y-4">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Arabic text skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-4/5 ml-auto" />
              <Skeleton className="h-8 w-3/4 ml-auto" />
            </div>

            {/* Translation skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Audio button skeleton */}
            <div className="flex items-center gap-2 pt-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default LoadingSkeleton
