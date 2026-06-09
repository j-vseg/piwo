import { Alert } from "@/components/Alert";
import Button from "@/components/Button";
import { ErrorIndicator } from "@/components/ErrorIndicator";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useAuth } from "@/contexts/auth";
import {
  fetchAllAccounts,
  updateAccountApproval,
  updateAccountRole,
} from "@/services/firebase/accounts";
import { Approval } from "@/types/approval";
import { Role } from "@/types/role";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { FieldValues, useForm } from "react-hook-form";

export default function ManagementOverview() {
  const { user, role } = useAuth();
  const queryClient = useQueryClient();
  const methods = useForm({ mode: "onChange" });
  const roleError = methods.formState.errors.role?.message as
    | string
    | undefined;
  const accountsError = methods.formState.errors.accounts?.message as
    | string
    | undefined;

  const { data, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn:
      user && (role === Role.Advisor || role === Role.BoardMember)
        ? () => fetchAllAccounts()
        : skipToken,
    staleTime: 30 * 60 * 1000,
  });

  const { isPending, error, mutate } = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: Role }) =>
      updateAccountRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const {
    isPending: isRevokePending,
    error: revokeError,
    mutate: revokeMutate,
  } = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      await Promise.all([
        updateAccountRole(userId, Role.Lid),
        updateAccountApproval(userId, Approval.Unknown),
      ]);
    },
    onSuccess: () => {
      methods.reset();
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["not-approved-user-number"],
      });
      queryClient.invalidateQueries({
        queryKey: ["not-approved-users"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function handleFormSubmit(formData: FieldValues) {
    const selectedAccounts = formData.accounts as string[];
    const selectedAction = formData.role as string;

    if (
      confirm(
        `Weet je zeker dat je ${selectedAccounts.length} gebruiker(s) naar ${selectedAction} wil wijzigen?`,
      )
    ) {
      selectedAccounts.forEach((accountId) => {
        const account = data?.find(
          (acc: { id: string }) => acc.id === accountId,
        );
        if (account?.role !== selectedAction) {
          if (selectedAction === "Revoke") {
            revokeMutate({ userId: accountId });
          } else {
            mutate({ userId: accountId, role: selectedAction as Role });
          }
        }
      });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2>Gebruikers beheren</h2>
      {(error || revokeError) && (
        <Alert type="danger" size="small">
          {error?.message ??
            revokeError?.message ??
            "Er is een onbekende fout opgetreden"}
        </Alert>
      )}
      <div className="p-4 pt-2 bg-white rounded-lg flex flex-col gap-0.5">
        <label className="text-[12px]">Selecteer een actie*</label>
        <select
          {...methods.register("role", { required: "Selecteer een actie" })}
          className="w-full text-gray-500"
        >
          <option value="">Selecteer..</option>
          {Object.values(Role).map((role) => (
            <option key={role} value={role}>
              Maak &apos;{role}&apos;
            </option>
          ))}
          <option value="Revoke" data-description="Toegang intrekken">
            Toegang intrekken (Toegang tot app intrekken)
          </option>
        </select>
        {roleError && (
          <div className="flex flex-row gap-2 items-center mt-1" role="alert">
            <FontAwesomeIcon
              className="text-error"
              size="sm"
              icon={faCircleInfo}
            />
            <p className="text-red-500 text-[12px]!">{roleError}</p>
          </div>
        )}
      </div>
      <form
        onSubmit={methods.handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-4"
      >
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <div className="flex flex-col gap-2">
              {!data || data.length <= 0 ? (
                <div className="py-2 px-4 bg-white rounded-lg">
                  <ErrorIndicator type="small">
                    Er zijn geen gebruikers gevonden
                  </ErrorIndicator>
                </div>
              ) : (
                data.map((account) => (
                  <div
                    key={account.id}
                    className={`py-2 px-4 bg-white rounded-lg gap-4 justify-between flex items-center cursor-pointer ${user?.uid === account.id || account.approval === Approval.Declined || account.approval === Approval.Unknown ? "bg-gray-200! cursor-not-allowed pointer-events-none" : ""}`}
                  >
                    <div className="flex gap-4">
                      <input
                        {...methods.register("accounts", {
                          validate: (value) =>
                            (Array.isArray(value) && value.length > 0) ||
                            "Selecteer minimaal één gebruiker",
                        })}
                        type="checkbox"
                        value={account.id}
                        disabled={
                          user?.uid === account.id ||
                          account.approval === Approval.Declined ||
                          account.approval === Approval.Unknown
                        }
                      />
                      <div className="flex flex-col justify-start">
                        <p>{`${account.firstName} ${account.lastName}`}</p>
                        {user?.uid === account.id && (
                          <p className="text-gray-500 text-[10px]!">
                            Je kan je eigen rol niet aanpassen
                          </p>
                        )}
                        {(account.approval === Approval.Declined ||
                          account.approval === Approval.Unknown) && (
                          <p className="text-gray-500 text-[10px]!">
                            Gebruiker is{" "}
                            {account.approval === Approval.Declined
                              ? "afgewezen"
                              : "in afwachting"}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm">{account.role}</p>
                  </div>
                ))
              )}
            </div>
            {accountsError && (
              <div className="flex flex-row gap-2 items-center" role="alert">
                <FontAwesomeIcon
                  className="text-error"
                  size="sm"
                  icon={faCircleInfo}
                />
                <p className="text-red-500 text-[12px]!">{accountsError}</p>
              </div>
            )}
          </>
        )}
        <Button type="submit" isPending={isPending || isRevokePending}>
          Actie uitvoeren
        </Button>
      </form>
    </div>
  );
}
