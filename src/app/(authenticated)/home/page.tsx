import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import {
  fetchAllOccurrencesGroupedByDate,
  fetchAllOccurrences,
} from "@/services/firebase/events";
import HomeScreen from "@/domians/home/home";
import { endOfWeek, nextMonday, startOfToday, startOfWeek } from "date-fns";

export const dynamic = "force-dynamic";

export default async function Home() {
  const queryClient = getQueryClient();

  const today = startOfToday();
  const upcomingMonday = nextMonday(today);
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["occurrences-grouped", upcomingMonday],
      queryFn: () => fetchAllOccurrencesGroupedByDate(upcomingMonday),
    }),
    queryClient.prefetchQuery({
      queryKey: ["this-week-occurrences", weekStart, weekEnd],
      queryFn: () => fetchAllOccurrences(weekStart, weekEnd),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeScreen />
    </HydrationBoundary>
  );
}
