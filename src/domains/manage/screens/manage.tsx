import { StyleSheet } from "react-native-unistyles";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTranslation } from "@/translations/i18n";

export default function ManageScreen() {
  const { t } = useTranslation();

  return (
    <ThemedView type="container" style={styles.container}>
      <ThemedText>Hrllo</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: theme.screen.default.backgroundColor,
    transform: [{ translateY: rt.insets.ime * -1 }],
  },
  form: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing(6),
    gap: theme.spacing(4),
  },
  button: {
    gap: theme.spacing(1),
  },
}));
