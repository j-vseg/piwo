import WhatIsNewOverview, {
  FEATURES_VERSION,
} from "@/components/WhatIsNew/WhatIsNew";
import { useAppStore } from "@/store/appStore";
import { useTranslation } from "@/translations/i18n";
import { useState } from "react";
import BottomSheet from "../BottomSheet/BottomSheet";
import Button from "../Button";
import { ThemedText } from "../ThemedText";

export default function WhatIsNewBottomSheet() {
  const { t } = useTranslation();
  const lastSeenVersion = useAppStore((s) => s.lastSeenFeaturesVersion);
  const setLastSeenVersion = useAppStore((s) => s.setLastSeenFeaturesVersion);

  const shouldShow = lastSeenVersion !== FEATURES_VERSION;
  const [isPresented, setIsPresented] = useState(shouldShow);

  const handleDismiss = () => {
    setIsPresented(false);
    setLastSeenVersion(FEATURES_VERSION);
  };

  if (!shouldShow && !isPresented) return null;

  return (
    <BottomSheet
      title={t("tabs.settings.whatIsNew.title")}
      isPresented={isPresented}
      onDismiss={handleDismiss}
      initialSnapIndex={1}
    >
      <ThemedText>{t("tabs.settings.whatIsNew.intro")}</ThemedText>
      <WhatIsNewOverview />

      <Button
        content={t("tabs.settings.whatIsNew.button")}
        accessibilityLabel={t("tabs.settings.whatIsNew.button")}
        accessibilityHint={t("tabs.settings.whatIsNew.button")}
        onPress={handleDismiss}
      />
    </BottomSheet>
  );
}
