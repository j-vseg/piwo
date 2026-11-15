import { Group } from "@/components/Group";
import ListTile from "@/components/ListTile";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { accountsCollection } from "@/config/firebase";
import { Approval } from "@/constants/Approval";
import { OS } from "@/constants/Os";
import { fetchAllAccounts } from "@/services/firebase/accounts";
import { useTranslation } from "@/translations/i18n";
import { query, where } from "@react-native-firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Platform } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ApprovalOverview } from "../components/ApprovalOverview";
import { BeerCardUrlSheet } from "../components/BeerCardUrlSheet";
import { SelectActivity } from "../components/SelectActivity";

export default function BestuurScreen() {
  const { t } = useTranslation();
  const { theme, rt } = useUnistyles();
  const [editActivityOpen, setEditActivityOpen] = useState(false);
  const [greenBeerCardUrlOpen, setGreenBeerCardUrlOpen] = useState(false);
  const [pinkBeerCardUrlOpen, setPinkBeerCardUrlOpen] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState<string | undefined>(
    undefined,
  );
  const { data: notApprovedData } = useQuery({
    queryKey: ["not-approved-users"],
    queryFn: () =>
      fetchAllAccounts(
        query(accountsCollection, where("approval", "==", Approval.Unknown)),
      ),
  });

  return (
    <>
      <ThemedView
        type="container"
        style={{
          gap: theme.spacing(10),
          paddingTop:
            Platform.OS === OS.Web
              ? rt.insets.top + theme.spacing(6)
              : rt.insets.top + theme.spacing(4),
        }}
      >
        <ThemedText type="h1">{t("tabs.bestuur.title")}</ThemedText>

        {notApprovedData && notApprovedData.length !== 0 && (
          <ThemedView style={{ gap: theme.spacing(4) }}>
            <ThemedView style={styles.container}>
              <ThemedText type="h3">Gebruikers in afwachting</ThemedText>
              <ThemedView style={styles.badge}>
                <ThemedText type="bodySmaller" style={styles.badgeText}>
                  {notApprovedData.length}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView>
              <Group>
                {notApprovedData.map((user) => (
                  <ListTile
                    key={user.id}
                    title={`${user.firstName} ${user.lastName}`}
                    onPress={() => setApprovalOpen(user.id)}
                  />
                ))}
              </Group>
            </ThemedView>
          </ThemedView>
        )}

        <ThemedView style={{ gap: theme.spacing(4) }}>
          <ThemedText type="h3">Beheren</ThemedText>

          <ThemedView style={styles.group}>
            <ThemedText type="h5">{t("bestuur.users")}</ThemedText>
            <Group>
              <ListTile
                title={t("tabs.bestuur.manageUsers")}
                onPress={() => router.push("/(tabs)/bestuur/manage-user")}
              />
            </Group>
          </ThemedView>

          <ThemedView style={styles.group}>
            <ThemedText type="h5">{t("settings.activitiesHeader")}</ThemedText>
            <Group>
              <ListTile
                title={t("tabs.settings.createActivity")}
                onPress={() => router.push("/(tabs)/bestuur/create-activity")}
              />
              <ListTile
                title={t("tabs.settings.editActivity")}
                onPress={() => setEditActivityOpen(true)}
              />
            </Group>
          </ThemedView>

          <ThemedView style={styles.group}>
            <ThemedText type="h5">{t("bestuur.beer_card.title")}</ThemedText>
            <Group>
              <ListTile
                title={t("bestuur.beer_card.green_url")}
                onPress={() => setGreenBeerCardUrlOpen(!greenBeerCardUrlOpen)}
                iconLeft={Platform.OS === OS.Web ? "sports-bar" : "sports_bar"}
              />
              <ListTile
                title={t("bestuur.beer_card.pink_url")}
                onPress={() => setPinkBeerCardUrlOpen(!pinkBeerCardUrlOpen)}
                iconLeft={Platform.OS === OS.Web ? "local-bar" : "local_bar"}
              />
            </Group>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <SelectActivity
        editActivityOpen={editActivityOpen}
        setEditActivityOpen={setEditActivityOpen}
      />

      {approvalOpen && (
        <ApprovalOverview
          key={approvalOpen}
          open
          setOpen={setApprovalOpen}
          userId={approvalOpen}
        />
      )}

      <BeerCardUrlSheet
        open={greenBeerCardUrlOpen}
        setOpen={setGreenBeerCardUrlOpen}
        type="green"
      />
      <BeerCardUrlSheet
        open={pinkBeerCardUrlOpen}
        setOpen={setPinkBeerCardUrlOpen}
        type="pink"
      />
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  group: {
    flexDirection: "column",
    gap: theme.spacing(2),
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  badge: {
    backgroundColor: theme.colors.warnings["error"],
    borderRadius: theme.borderRadius["full"],
    minWidth: 26,
    height: 26,
    paddingHorizontal: theme.spacing(1.5),
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: theme.colors.light["white"],
    fontWeight: theme.fontWeight.bold,
    lineHeight: 26,
    textAlign: "center",
  },
}));
