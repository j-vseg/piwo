import { Alert } from "@/components/Alert";
import { Group } from "@/components/Group";
import ListTile from "@/components/ListTile";
import LoadingIndicator from "@/components/LoadingIndicator";
import { ThemedView } from "@/components/ThemedView";
import { Approval } from "@/constants/Approval";
import { fetchAllAccounts } from "@/services/firebase/accounts";
import { useTranslation } from "@/translations/i18n";
import { getAuth } from "@react-native-firebase/auth";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useUnistyles } from "react-native-unistyles";
import { Account, ActionOverview } from "../components/ActionOverview";

export default function ManageUserScreen() {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const [actionOpen, setActionOpen] = useState<Account | undefined>(undefined);

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
      <ThemedView type="container">
        <ThemedView style={{ gap: theme.spacing(4) }}>
          {isLoadingAccounts ? (
            <LoadingIndicator />
          ) : isErrorAccounts ? (
            <Alert
              variant={"warning"}
              description={t("bestuur.manageUsersError")}
              size={"regular"}
            />
          ) : (
            <ThemedView>
              <Group>
                {accounts?.map((user) => {
                  if (user.approval !== Approval.Declined) {
                    return (
                      <ListTile
                        key={user.id}
                        title={`${user.firstName} ${user.lastName}`}
                        onPress={() => setActionOpen(user)}
                        subtitle={
                          user.id === getAuth().currentUser?.uid
                            ? t("bestuur.you")
                            : user.approval === Approval.Unknown
                              ? t("bestuur.userWaiting")
                              : undefined
                        }
                        disabled={
                          user.id === getAuth().currentUser?.uid ||
                          user.approval === Approval.Unknown
                        }
                      />
                    );
                  }
                })}
              </Group>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>

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
