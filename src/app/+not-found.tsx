import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTranslation } from "@/translations/i18n";
import { Link, Stack } from "expo-router";
import { Image } from "react-native";
import { useUnistyles } from "react-native-unistyles";

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const { theme } = useUnistyles();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView
        type="container"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: theme.spacing(4),
        }}
      >
        <Image
          source={require("@/assets/images/cat-404.jpg")}
          style={{ width: 200, height: 200, borderRadius: 16 }}
        />
        <ThemedText type="h2" style={{ textAlign: "center" }}>{t("notFound.title")}</ThemedText>
        <ThemedText style={{ textAlign: "center" }}>{t("notFound.description")}</ThemedText>
        <Link href="/" style={{ marginTop: theme.spacing(2) }}>
          <ThemedText
            style={{ color: theme.colors.primitives.primary }}
          >
            {t("notFound.link")}
          </ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}
