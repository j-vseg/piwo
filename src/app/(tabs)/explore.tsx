import { SymbolView } from "expo-symbols";
import { Platform, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { ExternalLink } from "@/components/external-link";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTranslation } from "@/translations/i18n";

export default function TabTwoScreen() {
  const { t } = useTranslation();
  const safeAreaInsets = useSafeAreaInsets();
  const { theme, rt } = useUnistyles();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + rt.insets.bottom + theme.spacing(4),
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(4),
    },
  });

  return (
    <ScrollView
      style={[
        styles.scrollView,
        { backgroundColor: theme.colors.primitives.quinary },
      ]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText>{t("tabs.explore")}</ThemedText>
          <ThemedText style={styles.centerText}>
            {t("explore.description")}
          </ThemedText>

          <ExternalLink href="https://docs.expo.dev" asChild>
            <Pressable style={({ pressed }) => pressed && styles.pressed}>
              <ThemedView style={styles.linkButton}>
                <ThemedText>{t("explore.expoDocumentation")}</ThemedText>
                <SymbolView
                  tintColor={theme.colors.dark.black}
                  name={{
                    ios: "arrow.up.right.square",
                    android: "link",
                    web: "link",
                  }}
                  size={12}
                />
              </ThemedView>
            </Pressable>
          </ExternalLink>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    flexGrow: 1,
  },
  titleContainer: {
    gap: theme.spacing(4),
    alignItems: "center",
    paddingHorizontal: theme.spacing(6),
    paddingVertical: theme.spacing(16),
  },
  centerText: {
    textAlign: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  linkButton: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing(6),
    paddingVertical: theme.spacing(2),
    borderRadius: theme.spacing(8),
    justifyContent: "center",
    gap: theme.spacing(1),
    alignItems: "center",
  },
  sectionsWrapper: {
    gap: theme.spacing(8),
    paddingHorizontal: theme.spacing(6),
    paddingTop: theme.spacing(4),
  },
  collapsibleContent: {
    alignItems: "center",
  },
  imageTutorial: {
    width: "100%",
    aspectRatio: 296 / 171,
    borderRadius: theme.spacing(4),
    marginTop: theme.spacing(2),
  },
  imageReact: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
}));
