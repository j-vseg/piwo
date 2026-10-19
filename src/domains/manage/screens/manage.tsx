import { Alert } from "@/components/Alert";
import { Group } from "@/components/Group";
import ListTile from "@/components/ListTile";
import LoadingIndicator from "@/components/LoadingIndicator";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Approval } from "@/constants/Approval";
import { OS } from "@/constants/Os";
import { accountsCollection } from "@/firebase";
import { fetchAllAccounts } from "@/services/firebase/accounts";
import { useTranslation } from "@/translations/i18n";
import { getAuth } from "@react-native-firebase/auth";
import { query, where } from "@react-native-firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Platform } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Account, ActionOverview } from "../components/ActionOverview";
import { ApprovalOverview } from "../components/ApprovalOverview";

export default function ManageScreen() {
  const { t } = useTranslation();
  const { theme, rt } = useUnistyles();
  const [approvalOpen, setApprovalOpen] = useState<string | undefined>(
    undefined,
  );
  const [actionOpen, setActionOpen] = useState<Account | undefined>(undefined);
  const { data: notApprovedData } = useQuery({
    queryKey: ["not-approved-users"],
    queryFn: () =>
      fetchAllAccounts(
        query(accountsCollection, where("approval", "==", Approval.Unknown)),
      ),
  });

  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    isError: isErrorAccounts,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => fetchAllAccounts(),
  });

  return (
    <>
      <ThemedView
        type="container"
        style={{
          gap: theme.spacing(8),
          paddingTop:
            Platform.OS === OS.Web
              ? rt.insets.top + theme.spacing(6)
              : rt.insets.top + theme.spacing(4),
        }}
      >
        <ThemedText type="h1">{t("tabs.manage")}</ThemedText>

        {notApprovedData && notApprovedData.length !== 0 && (
          <ThemedView style={{ gap: theme.spacing(4) }}>
            <ThemedText type="h3">Gebruikers in afwachting</ThemedText>
            <ThemedView>
              <Group>
                {notApprovedData.map((user) => (
                  <ListTile
                    key={user.id}
                    text={`${user.firstName} ${user.lastName}`}
                    onPress={() => setApprovalOpen(user.id)}
                  />
                ))}
              </Group>
            </ThemedView>
          </ThemedView>
        )}

        <ThemedView style={{ gap: theme.spacing(4) }}>
          <ThemedText type="h3">Gebruikers beheren</ThemedText>
          {isLoadingAccounts ? (
            <LoadingIndicator />
          ) : isErrorAccounts ? (
            <Alert
              variant={"warning"}
              description={
                "Er is iets missgegaan met het ophalen van alles accounts"
              }
              size={"regular"}
            />
          ) : (
            <ThemedView>
              <Group>
                {accounts?.map((user) => (
                  <ListTile
                    key={user.id}
                    text={`${user.firstName} ${user.lastName}`}
                    onPress={() => setActionOpen(user)}
                    disabled={user.id === getAuth().currentUser?.uid}
                  />
                ))}
              </Group>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>

      {approvalOpen && (
        <ApprovalOverview
          key={approvalOpen}
          open
          setOpen={setApprovalOpen}
          userId={approvalOpen}
        />
      )}

      {actionOpen && (
        <ActionOverview
          open={!!actionOpen}
          setOpen={setActionOpen}
          user={actionOpen}
        />
      )}
    </>
  );
}
