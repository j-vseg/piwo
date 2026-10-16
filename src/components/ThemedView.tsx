import { View, type ViewProps } from "react-native";
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
        <View style={[styles.container(), style]} {...otherProps} />
      </View>
    );
  }

  return <View style={style} {...otherProps} />;
}

const styles = StyleSheet.create((theme, rt) => ({
  wrapper: {
    backgroundColor: theme.colors.primitives["quinary"],
    flex: 1,
    alignItems: "center",
  },
  container: () => ({
    flex: 1,
    width: "100%",
    maxWidth: 800,
    paddingHorizontal: theme.spacing(3),
    paddingTop: rt.insets.top,
    paddingBottom: rt.insets.bottom + 30,
  }),
}));
