import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import { getOccurrenceById } from "@/services/firebase/events";
import { getOccurrenceAvailability } from "@/services/firebase/availability";
import { ActivityPage } from "@/domians/activity/activity";

export default async function Activity({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  if (!id) {
    return null;
  }

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["occurrence", id],
      queryFn: () => getOccurrenceById(id),
    }),
    queryClient.prefetchQuery({
      queryKey: ["occurrenceAvailability", id],
      queryFn: () => getOccurrenceAvailability(id),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ActivityPage id={id} />
    </HydrationBoundary>
  );
}
