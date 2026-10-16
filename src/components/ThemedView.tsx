import { OS } from "@/constants/Os";
import { Platform, View, type ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export type ThemedViewProps = ViewProps & {
  type?: "default" | "container" | "s-container";
};

export function ThemedView({
  style,
  type = "default",
  ...otherProps
}: ThemedViewProps) {
  return (
    <View
      style={[
        type === "container" && styles.container(Platform.OS),
        type === "s-container" && styles.smallContainer,
        style,
      ]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  background: {
    backgroundColor: theme.colors.primitives["quinary"],
  },
  container: (os: typeof Platform.OS) => ({
    flex: 1,
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    paddingTop: rt.insets.top,
    paddingBottom:
      os === OS.Android ? rt.insets.bottom + 30 : rt.insets.bottom + 100,
  }),
  smallContainer: {
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
}));
