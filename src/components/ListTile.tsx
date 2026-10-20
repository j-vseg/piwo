import { OS } from "@/constants/Os";
import { Platform, Pressable, type TextStyle } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { IconName, IconSymbol } from "./IconSymbol/IconSymbol";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type ListTileProps = {
  text: string;
  iconLeft?: IconName;
  iconRight?: IconName;
  onPress: () => void;
  textStyle?: TextStyle;
  disabled?: boolean;
};

export default function ListTile({
  text,
  iconLeft,
  iconRight = Platform.OS === OS.Web
    ? ("chevron-right" as any)
    : "chevron_forward",
  onPress,
  textStyle,
  disabled,
}: ListTileProps) {
  const { theme } = useUnistyles();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={text}
      onPress={onPress}
      style={styles.listTile(disabled)}
      disabled={disabled}
    >
      {iconLeft && (
        <ThemedView
          style={styles.leftContainer}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
        >
          <IconSymbol
            size={24}
            name={iconLeft}
            color={theme.colors.dark["black"]}
            style={{ fontWeight: theme.fontWeight.extraLight }}
          />
        </ThemedView>
      )}
      <ThemedText
        type="bodyMedium"
        style={[styles.text, textStyle]}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      >
        {text}
      </ThemedText>
      <ThemedView
        style={styles.rightContainer}
        importantForAccessibility="no-hide-descendants"
      >
        <IconSymbol
          size={24}
          name={iconRight}
          color={theme.colors.dark["black"]}
          accessible={false}
        />
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  listTile: (disabled: boolean | undefined) => ({
    paddingHorizontal: theme.spacing(4),
    minHeight: 56,
    margin: 0,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing(4),
    backgroundColor: disabled
      ? theme.button.primary.disabled.backgroundColor
      : theme.colors.light["white"],
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.colors.dark["greyLight"],
  }),
  leftContainer: {
    backgroundColor: theme.colors.transparent,
    flexDirection: "row",
  },
  rightContainer: {
    backgroundColor: theme.colors.transparent,
    flexDirection: "row",
  },
  text: {
    flex: 1,
  },
}));
