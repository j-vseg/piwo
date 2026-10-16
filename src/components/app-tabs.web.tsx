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
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

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
        <ThemedText type="bodySmall">{children}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const { theme } = useUnistyles();

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView style={styles.innerContainer}>
        <ThemedText style={styles.brandText}>
          Expo Starter
        </ThemedText>

        {props.children}

        <ExternalLink href="https://docs.expo.dev" asChild>
          <Pressable style={styles.externalPressable}>
            <ThemedText>Docs</ThemedText>
            <SymbolView
              tintColor={theme.colors.dark.black}
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
    padding: theme.spacing(4),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  innerContainer: {
    paddingVertical: theme.spacing(2),
    paddingHorizontal: theme.spacing(8),
    borderRadius: theme.spacing(8),
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
    gap: theme.spacing(2),
  },
  brandText: {
    marginRight: "auto",
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: theme.spacing(1),
    paddingHorizontal: theme.spacing(4),
    borderRadius: theme.spacing(4),
  },
  externalPressable: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(1),
    marginLeft: theme.spacing(4),
  },
}));
