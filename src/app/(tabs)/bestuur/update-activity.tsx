import UpdateActivityScreen from "@/domains/manage/screens/update-activity";
import { useLocalSearchParams } from "expo-router";

export default function Screen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <UpdateActivityScreen id={id} />;
}
