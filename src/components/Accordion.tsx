import { IconSymbol } from "@/components/IconSymbol/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTranslation } from "@/translations/i18n";
import { ReactNode, useState } from "react";
import { Pressable } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export function Accordion({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: opened }}
        accessibilityLabel={t("service.faq.accordion.accessibilityLabel", {
          title: title,
          state: opened
            ? t("service.faq.accordion.expanded")
            : t("service.faq.accordion.collapsed"),
          hint: opened
            ? t("service.faq.accordion.collapseHint")
            : t("service.faq.accordion.expandHint"),
        })}
        accessibilityHint={
          opened
            ? t("service.faq.accordion.collapseHint")
            : t("service.faq.accordion.expandHint")
        }
        style={styles.header}
        onPress={() => setOpened(!opened)}
      >
        <ThemedText type="bodyMedium" style={styles.title}>
          {title}
        </ThemedText>
        <IconSymbol
          name={opened ? "keyboard_arrow_up" : "keyboard_arrow_down"}
          size={24}
          color={styles.icon.color}
          accessible={false}
          style={styles.icon}
        />
      </Pressable>

      {opened && (
        <ThemedView style={styles.descriptionContainer}>{children}</ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    justifyContent: "center",
    backgroundColor: theme.colors.light.white,
    paddingVertical: theme.spacing(3),
    paddingHorizontal: theme.spacing(4),
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.colors.dark["greyLight"],
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing(1),
  },
  title: {
    flex: 1,
  },
  icon: {
    color: theme.colors.dark.black,
  },
  descriptionContainer: {
    paddingVertical: theme.spacing(6),
    paddingHorizontal: theme.spacing(4),
  },
}));
