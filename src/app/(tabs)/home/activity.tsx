import ActivityScreen from "@/domains/home/screens/activity";
import { useLocalSearchParams } from "expo-router";

export default function Screen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ActivityScreen id={id} />;
}
