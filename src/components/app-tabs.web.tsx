import {
  TabList,
  TabListProps,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from "expo-router/ui";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { ExternalLink } from "./external-link";
import { ThemedView } from "./themed-view";
import { ThemedText } from "./ThemedText";

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: "100%" }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>Explore</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({
  children,
  isFocused,
  ...props
}: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView style={styles.tabButtonView}>
        <ThemedText type="small">{children}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const { theme } = useUnistyles();

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView style={styles.innerContainer}>
        <ThemedText type="smallBold" style={styles.brandText}>
          Expo Starter
        </ThemedText>

        {props.children}

        <ExternalLink href="https://docs.expo.dev" asChild>
          <Pressable style={styles.externalPressable}>
            <ThemedText type="link">Docs</ThemedText>
            <SymbolView
              tintColor={theme.colors.content.primary}
              name={{ ios: "arrow.up.right.square", web: "link" }}
              size={12}
            />
          </Pressable>
        </ExternalLink>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  tabListContainer: {
    position: "absolute",
    width: "100%",
    padding: theme.gap(4),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  innerContainer: {
    paddingVertical: theme.gap(2),
    paddingHorizontal: theme.gap(8),
    borderRadius: theme.gap(8),
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
    gap: theme.gap(2),
  },
  brandText: {
    marginRight: "auto",
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: theme.gap(1),
    paddingHorizontal: theme.gap(4),
    borderRadius: theme.gap(4),
  },
  externalPressable: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.gap(1),
    marginLeft: theme.gap(4),
  },
}));
