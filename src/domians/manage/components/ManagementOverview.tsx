import Button from "@/components/Button";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useAuth } from "@/contexts/auth";
import { fetchAllAccounts } from "@/services/firebase/accounts";
import { Role } from "@/types/role";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export default function ManagementOverview() {
  const { user, role } = useAuth();
  const methods = useForm({ mode: "onChange" });
  const roleError = methods.formState.errors.role?.message as string | undefined;
  const accountsError = methods.formState.errors.accounts?.message as string | undefined;

  const { data, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn:
      user && (role === Role.Advisor || role === Role.Chairman)
        ? () => fetchAllAccounts()
        : skipToken,
    staleTime: 30 * 60 * 1000,
  });

  return (
    <div className="flex flex-col gap-4">
      <h2>Gebruikers beheren</h2>
      <div className="p-4 pt-2 bg-white rounded-lg flex flex-col gap-0.5">
        <label className="text-[12px]">Selecteer een rol*</label>
        <select
          {...methods.register("role", { required: "Selecteer een rol" })}
          className="w-full text-gray-500"
        >
          <option value="">Selecteer..</option>
          {Object.values(Role).map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
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
        onSubmit={methods.handleSubmit((data) => console.log(data))}
        className="flex flex-col gap-4"
      >
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <div className="flex flex-col gap-2">
              {data?.map((account) => (
                <div
                  key={account.id}
                  className="py-2 px-4 bg-white rounded-lg flex justify-between items-center cursor-pointer"
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
                    />
                    <p>{`${account.firstName} ${account.lastName}`}</p>
                  </div>
                  <p className="text-gray-500 text-sm">{account.role}</p>
                </div>
              ))}
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
        <Button type="submit">Aanpassen</Button>
      </form>
    </div>
  );
}