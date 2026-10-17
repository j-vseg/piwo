import { OS } from "@/constants/Os";
import { Platform, ScrollView, View, type ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export type ThemedViewProps = ViewProps & {
  type?: "default" | "container";
};

export function ThemedView({
  style,
  type = "default",
  ...otherProps
}: ThemedViewProps) {
  if (type === "container") {
    return (
      <View style={styles.wrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.container(), style]}
          {...otherProps}
        />
      </View>
    );
  }

  return <View style={style} {...otherProps} />;
}

const styles = StyleSheet.create((theme, rt) => ({
  wrapper: {
    backgroundColor: theme.screen.default.backgroundColor,
    flex: 1,
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  container: () => ({
    width: "100%",
    maxWidth: 800,
    alignSelf: "center" as const,
    paddingHorizontal: theme.spacing(3),
    paddingTop:
      Platform.OS === OS.Web
        ? rt.insets.top + theme.spacing(6)
        : theme.spacing(6),
    paddingBottom: Platform.OS === OS.Web ? rt.insets.bottom + 30 : 30,
    flexDirection: "column",
    gap: theme.spacing(4),
  }),
}));
