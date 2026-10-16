import { SymbolView } from "expo-symbols";
import { Platform, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { ExternalLink } from "@/components/external-link";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/ThemedText";

export default function TabTwoScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const { theme, rt } = useUnistyles();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + rt.insets.bottom + theme.gap(4),
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: theme.gap(6),
      paddingBottom: theme.gap(4),
    },
  });

  return (
    <ScrollView
      style={[
        styles.scrollView,
        { backgroundColor: theme.colors.brand.primary },
      ]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">Explore</ThemedText>
          <ThemedText style={styles.centerText}>
            This starter app includes example{"\n"}code to help you get started.
          </ThemedText>

          <ExternalLink href="https://docs.expo.dev" asChild>
            <Pressable style={({ pressed }) => pressed && styles.pressed}>
              <ThemedView style={styles.linkButton}>
                <ThemedText type="link">Expo documentation</ThemedText>
                <SymbolView
                  tintColor={theme.colors.content.primary}
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
    gap: theme.gap(4),
    alignItems: "center",
    paddingHorizontal: theme.gap(6),
    paddingVertical: theme.gap(16),
  },
  centerText: {
    textAlign: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  linkButton: {
    flexDirection: "row",
    paddingHorizontal: theme.gap(6),
    paddingVertical: theme.gap(2),
    borderRadius: theme.gap(8),
    justifyContent: "center",
    gap: theme.gap(1),
    alignItems: "center",
  },
  sectionsWrapper: {
    gap: theme.gap(8),
    paddingHorizontal: theme.gap(6),
    paddingTop: theme.gap(4),
  },
  collapsibleContent: {
    alignItems: "center",
  },
  imageTutorial: {
    width: "100%",
    aspectRatio: 296 / 171,
    borderRadius: theme.gap(4),
    marginTop: theme.gap(2),
  },
  imageReact: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
}));
