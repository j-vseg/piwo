import { Role } from "@/constants/Role";
import { useAppStore } from "@/store/appStore";
import { useTranslation } from "@/translations/i18n";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useUnistyles } from "react-native-unistyles";

export default function TabsLayout() {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const role = useAppStore((s) => s.role);

  return (
    <NativeTabs
      backgroundColor={theme.colors.light.white}
      indicatorColor={theme.colors.primitives.quinary}
      labelStyle={{ selected: { color: theme.colors.primitives.primary } }}
      iconColor={{
        default: theme.tabBar.inactiveTintColor,
        selected: theme.tabBar.activeTintColor,
      }}
    >
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>{t("tabs.home")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/cabin.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger
        name="manage"
        hidden={role !== Role.BoardMember && role !== Role.Advisor}
      >
        <NativeTabs.Trigger.Label>{t("tabs.manage")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Badge>9+</NativeTabs.Trigger.Badge>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/group.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>
          {t("tabs.settings.main")}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/settings.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
