import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native-unistyles";

interface DividerProps {
  label: string;
  centered?: boolean;
}

export function Divider({ label, centered = false }: DividerProps) {
  return (
    <ThemedView style={styles.container}>
      {centered && <ThemedView style={styles.line} />}
      <ThemedText type="bodySmaller" style={styles.label}>
        {label}
      </ThemedText>
      <ThemedView style={styles.line} />
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    gap: theme.spacing(2),
    alignItems: "center",
  },
  line: {
    flex: 1,
    height: 1,
    marginBottom: 2,
    backgroundColor: theme.colors.dark.greyMedium,
  },
  label: {
    textTransform: "uppercase",
    fontFamily: theme.font.crimsonPro.semibold.fontFamily,
    color: theme.colors.dark.greyMedium,
  },
}));
