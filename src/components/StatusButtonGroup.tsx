import { AVAILABILITY_SELECTOR_STATUSES, Status } from "@/constants/Status";
import { Pressable, ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { ThemedText } from "./ThemedText";

interface StatusButtonGroupProps {
  selected?: Status | null;
  eventColor: string;
  disabled?: boolean;
  counts?: Partial<Record<Status, number>>;
  onSelect: (status: Status) => void;
}

export function StatusButtonGroup({
  selected,
  eventColor,
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
      {AVAILABILITY_SELECTOR_STATUSES.map((statusOption) => (
        <Pressable
          key={statusOption}
          style={[
            styles.button(statusOption, selected),
            selected !== statusOption && { backgroundColor: eventColor },
          ]}
          onPress={() => onSelect(statusOption)}
          disabled={disabled}
        >
          <View style={styles.buttonContent}>
            <ThemedText type="button" style={styles.text}>
              {statusOption}
            </ThemedText>
            {counts?.[statusOption] != null && (
              <View style={styles.badge}>
                <ThemedText type="bodySmaller" style={styles.badgeText}>
                  {counts[statusOption]}
                </ThemedText>
              </View>
            )}
          </View>
        </Pressable>
      ))}
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
  button: (statusOption: Status, selected?: Status | null) => ({
    borderRadius: 8,
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(1),
    alignItems: "center" as const,
    ...(selected === statusOption && {
      backgroundColor:
        selected === Status.Present || selected === Status.Later
          ? theme.colors.warnings.positive
          : selected === Status.Maybe
            ? theme.colors.warnings.warning
            : selected === Status.Absent
              ? theme.colors.warnings.negative
              : undefined,
    }),
  }),
  buttonContent: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: theme.spacing(2),
  },
  text: {
    fontFamily: theme.font.poppins.regular.fontFamily,
    fontWeight: theme.font.poppins.regular.fontWeight,
    fontSize: 16,
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
    fontFamily: theme.font.poppins.bold.fontFamily,
    fontWeight: theme.font.poppins.bold.fontWeight,
  },
}));
