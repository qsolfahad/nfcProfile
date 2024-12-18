import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function UserProfileSkeleton() {
  return (
    <div className="min-h-screen bg-white p-4 flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border-none shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-48">
            <Skeleton className="h-full w-full" />
            
          </div>

          <div className="relative px-6 pb-6">
            <div className="flex justify-center">
              <Skeleton className="absolute -top-16 w-32 h-32 rounded-full border-4 border-white" />
            </div>

            <div className="mt-20 text-center space-y-2">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-6 w-40 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <Skeleton className="mt-2 h-4 w-16" />
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>

            <div className="mt-4 flex justify-center">
              <Skeleton className="h-4 w-48" />
            </div>

            <div className="mt-6 flex justify-center">
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

