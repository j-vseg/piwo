import { Category } from "@/constants/Category";
import { AVAILABILITY_SELECTOR_STATUSES, Status } from "@/constants/Status";
import { lightTheme } from "@/themes/light";
import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Button from "./Button";
import { ThemedText } from "./ThemedText";

type ButtonVariant = keyof typeof lightTheme.button;

const STATUS_BUTTON_VARIANT: Record<Status, ButtonVariant> = {
  [Status.Present]: "success",
  [Status.Later]: "success",
  [Status.Maybe]: "warning",
  [Status.Absent]: "error",
};

const CATEGORY_BUTTON_VARIANT: Record<Category, ButtonVariant> = {
  [Category.Group]: "categoryGroup",
  [Category.Weekend]: "categoryWeekend",
  [Category.Camp]: "categoryCamp",
  [Category.Action]: "categoryAction",
};

interface StatusButtonGroupProps {
  selected?: Status | null;
  disabled?: boolean;
  counts?: Partial<Record<Status, number>>;
  category?: Category;
  onSelect: (status: Status) => void;
}

export function StatusButtonGroup({
  selected,
  disabled,
  counts,
  category,
  onSelect,
}: StatusButtonGroupProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {AVAILABILITY_SELECTOR_STATUSES.map((statusOption) => {
        const isActive =
          selected === statusOption ||
          (statusOption === Status.Present && selected === Status.Later);
        const variant = STATUS_BUTTON_VARIANT[statusOption];

        return (
          <Button
            key={statusOption}
            accessibilityLabel={
              isActive && selected === Status.Later
                ? Status.Later
                : statusOption
            }
            accessibilityHint={"undefined"}
            type={isActive ? variant : category ? CATEGORY_BUTTON_VARIANT[category] : "secondary"}
            onPress={() => onSelect(statusOption)}
            onLongPress={
              statusOption === Status.Present
                ? () => onSelect(Status.Later)
                : undefined
            }
            disabled={disabled}
            buttonStyle={styles.statusButton}
            content={(_, textColor) => (
              <View style={styles.buttonContent}>
                <ThemedText
                  type="bodySmall"
                  style={{ color: textColor }}
                  selectable={false}
                >
                  {isActive && selected === Status.Later
                    ? Status.Later
                    : statusOption}
                </ThemedText>
                {counts?.[statusOption] != null && (
                  <View style={styles.badge}>
                    <ThemedText
                      type="bodySmaller"
                      style={[styles.badgeText, { color: textColor }]}
                      selectable={false}
                    >
                      {counts[statusOption]}
                    </ThemedText>
                  </View>
                )}
              </View>
            )}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexGrow: 1,
    flexDirection: "row",
    gap: theme.spacing(2),
    justifyContent: "space-between",
  },
  statusButton: {
    width: "auto",
    minHeight: 48,
    minWidth: 48,
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  buttonContent: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: theme.spacing(2),
  },
  badge: {
    backgroundColor: theme.colors.dark.black_10,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing(1),
  },
  badgeText: {
    fontSize: 11,
    fontFamily: theme.font.googleSansFlex.bold.fontFamily,
    fontWeight: theme.font.googleSansFlex.bold.fontWeight,
  },
}));
