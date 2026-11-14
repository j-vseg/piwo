import { AVAILABILITY_SELECTOR_STATUSES, Status } from "@/constants/Status";
import { Pressable, ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { ThemedText } from "./ThemedText";
import { lightTheme } from "@/themes/light";

type ButtonVariant = keyof typeof lightTheme.button;

const STATUS_BUTTON_VARIANT: Record<Status, ButtonVariant> = {
  [Status.Present]: "success",
  [Status.Later]: "success",
  [Status.Maybe]: "warning",
  [Status.Absent]: "error",
};

interface StatusButtonGroupProps {
  selected?: Status | null;
  disabled?: boolean;
  counts?: Partial<Record<Status, number>>;
  onSelect: (status: Status) => void;
}

export function StatusButtonGroup({
  selected,
  disabled,
  counts,
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
          <Pressable
            key={statusOption}
            onPress={() => onSelect(statusOption)}
            onLongPress={
              statusOption === Status.Present
                ? () => onSelect(Status.Later)
                : undefined
            }
            disabled={disabled}
          >
            {({ pressed }) => (
              <View style={styles.buttonContainer}>
                <View
                  style={[
                    styles.buttonInner,
                    !isActive && styles.buttonInnerDefault,
                    pressed && styles.buttonInnerPressed(variant),
                    isActive && styles.buttonInnerActive(variant),
                  ]}
                >
                  <View style={styles.buttonContent}>
                    <ThemedText
                      type="bodySmall"
                      style={[
                        styles.label,
                        pressed && styles.labelPressed(variant),
                        isActive && styles.labelActive(variant),
                      ]}
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
                          style={[
                            styles.badgeText,
                            pressed && styles.labelPressed(variant),
                            isActive && styles.labelActive(variant),
                          ]}
                          selectable={false}
                        >
                          {counts[statusOption]}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}
          </Pressable>
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
  buttonContainer: {
    minHeight: 48,
    minWidth: 48,
    justifyContent: "center" as const,
  },
  buttonInner: {
    borderRadius: theme.borderRadius["full"],
    paddingHorizontal: theme.spacing(4),
    paddingVertical: theme.spacing(3),
    justifyContent: "center" as const,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: "transparent",
  },
  buttonInnerDefault: {
    backgroundColor: theme.button.secondary["default"].backgroundColor,
    borderColor: theme.button.secondary["default"].borderColor,
    borderRadius: theme.borderRadius["lg"],
    borderBottomWidth: 4,
    borderBottomColor: theme.button.secondary["default"].innerShadow.color,
  },
  buttonInnerPressed: (variant: ButtonVariant) => ({
    backgroundColor: theme.button[variant]["active"].backgroundColor,
    borderColor: theme.button[variant]["active"].borderColor,
    borderRadius: theme.borderRadius["lg"],
    borderBottomWidth: 4,
    borderBottomColor: theme.button[variant]["active"].innerShadow.color,
  }),
  buttonInnerActive: (variant: ButtonVariant) => ({
    backgroundColor: theme.button[variant]["default"].backgroundColor,
    borderColor: theme.button[variant]["default"].borderColor,
    borderRadius: theme.borderRadius["lg"],
    borderBottomWidth: 4,
    borderBottomColor: theme.button[variant]["default"].innerShadow.color,
  }),
  buttonContent: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: theme.spacing(2),
  },
  label: {
    textAlign: "center" as const,
    color: theme.button.secondary["default"].textColor,
  },
  labelPressed: (variant: ButtonVariant) => ({
    color: theme.button[variant]["active"].textColor,
  }),
  labelActive: (variant: ButtonVariant) => ({
    color: theme.button[variant]["default"].textColor,
  }),
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
