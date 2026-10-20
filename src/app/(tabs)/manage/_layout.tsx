import { Role } from "@/constants/Role";
import { useAppStore } from "@/store/appStore";
import { Stack } from "expo-router";

export default function ManageLayout() {
  const role = useAppStore((s) => s.role);
  const isAuthorized = role === Role.BoardMember || role === Role.Advisor;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthorized}>
        <Stack.Screen name="index" />
      </Stack.Protected>
    </Stack>
  );
}
