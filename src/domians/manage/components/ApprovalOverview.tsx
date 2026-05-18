import { Alert } from "@/components/Alert";
import Button from "@/components/Button";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { updateAccountApproval } from "@/services/firebase/accounts";
import { Approval } from "@/types/approval";
import { getFontAwesomeIconForBadge } from "@/utils/getFontAwesomeIconForBadge";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ApprovalOverview({
  data,
}: {
  data: {
    id: string;
    firstName: string;
    lastName: string;
  }[];
}) {
    const queryClient = useQueryClient();

    const { isPending, isError, error, mutate } = useMutation({
      mutationFn: ({
        userId,
        approval,
      }: {
        userId: string;
        approval: Approval;
      }) => updateAccountApproval(userId, approval),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["not-approved-user-number"],
        });
        queryClient.invalidateQueries({
          queryKey: ["not-approved-users"],
        });
        queryClient.invalidateQueries({
          queryKey: ["accounts"],
        });
      },
      onError: (error) => {
        console.log(error);
      },
    });

    const handleApproval = (userId: string, firstname: string, approval: Approval) => {
        if (confirm(`Weet je zeker dat je ${firstname} wil ${approval === Approval.Accepted ? "toelaten" : "afkeuren"}?`)) {
          mutate({ userId, approval });
        }
      };

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <h2>Wachten op toelating</h2>
          {!isError && data && data.length > 0 && (
            <div className="bg-error rounded-full w-5 h-5 flex items-center justify-center">
              <FontAwesomeIcon
                icon={getFontAwesomeIconForBadge(data.length)}
                size="sm"
                className={`max-h-2! text-white font-bold`}
                shake
              />
              {data.length > 9 && (
                <p className="text-white text-[8px]! -ml-1">+</p>
              )}
            </div>
          )}
        </div>
        {error && (
          <Alert type="danger" size="small">
            {error?.message ?? "Er is een onbekende fout opgetreden"}
          </Alert>
        )}
        {data?.map((user) => (
          <div
            key={user.id}
            className="py-2 px-4 bg-white rounded-lg flex items-center justify-between"
          >
            <p>{`${user.firstName} ${user.lastName}`}</p>
            <div className="flex gap-2">
              {isPending ? (
                <LoadingIndicator />
              ) : (
                <>
                  <Button
                    className="bg-background-success! rounded-md px-1.5! py-0.5!"
                    isPending={isPending}
                    onClick={() =>
                      handleApproval(user.id, user.firstName, Approval.Accepted)
                    }
                  >
                    <FontAwesomeIcon
                      icon={faCheck}
                      size="sm"
                      className={`max-h-5! text-success`}
                    />
                  </Button>
                  <Button
                    className="bg-background-error! rounded-md px-1.5! py-0.5!"
                    isPending={isPending}
                    onClick={() =>
                      handleApproval(user.id, user.firstName, Approval.Declined)
                    }
                  >
                    <FontAwesomeIcon
                      icon={faX}
                      size="sm"
                      className={`max-h-5! text-error`}
                    />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );
}