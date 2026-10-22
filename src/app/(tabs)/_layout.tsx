import { accountsCollection } from "@/config/firebase";
import { Approval } from "@/constants/Approval";
import { Role } from "@/constants/Role";
import { fetchAllAccounts } from "@/services/firebase/accounts";
import { useAppStore } from "@/store/appStore";
import { useTranslation } from "@/translations/i18n";
import { query, where } from "@react-native-firebase/firestore";
import { skipToken, useQuery } from "@tanstack/react-query";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useUnistyles } from "react-native-unistyles";

export default function TabsLayout() {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const role = useAppStore((s) => s.role);
  const { data } = useQuery({
    queryKey: ["not-approved-users-number"],
    queryFn:
      role === Role.BoardMember || role === Role.Advisor
        ? () =>
            fetchAllAccounts(
              query(
                accountsCollection,
                where("approval", "==", Approval.Unknown),
              ),
            )
        : skipToken,
  });

  return (
    <NativeTabs
      backgroundColor={theme.colors.light.white}
      indicatorColor={theme.colors.primitives.quinary}
      labelStyle={{ selected: { color: theme.colors.primitives.primary } }}
      iconColor={{
        default: theme.tabBar.inactiveTintColor,
        selected: theme.tabBar.activeTintColor,
      }}
      rippleColor={theme.colors.primitives.quinary}
      badgeBackgroundColor={theme.colors.warnings.negative}
      badgeTextColor={theme.colors.dark.black}
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
        {data && data.length > 0 && (
          <NativeTabs.Trigger.Badge>
            {data.length > 9 ? "9+" : String(data.length)}
          </NativeTabs.Trigger.Badge>
        )}
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
