import { OS } from "@/constants/Os";
import { Platform, Pressable } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { IconSymbol } from "../IconSymbol/IconSymbol";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

type HeaderProps = {
  title: string;
  onClose: () => void;
};

export default function Header({ title, onClose }: HeaderProps) {
  const { theme } = useUnistyles();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h3">{title}</ThemedText>
      <Pressable onPress={onClose} accessibilityLabel="Close">
        <IconSymbol name="close" size={24} color={theme.colors.dark.black} />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing(4),
    paddingVertical: Platform.OS == OS.Web ? theme.spacing(4) : undefined,
    marginBottom: theme.spacing(3),
  },
}));
