import { Card, CardContent, CardHeader } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';

export default function ProfileLoading() {
  return (
    <section className="w-2xl mx-auto px-4 py-10">
      <Card>
        <CardHeader className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <Skeleton className="mb-1 h-4 w-32" />
              <Skeleton className="h-4 w-56" />
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
