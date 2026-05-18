"use client";

import Lottie from "lottie-react";
import waiting from "@/../assets/waiting.json";
import Button from "@/components/Button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import { accountsCollection, auth } from "@/services/firebase/firebase";
import { Alert } from "@/components/Alert";
import {
  deleteUserAccount,
  fetchAllAccounts,
} from "@/services/firebase/accounts";
import { useAuth } from "@/contexts/auth";
import { getRandomEventColor } from "@/utils/getRandomEventColor";
import { Approval } from "@/types/approval";
import { query, where } from "firebase/firestore";
import { Role } from "@/types/role";

export default function VerificationScreen() {
  const { user, approval } = useAuth();
  const randomEventColor = getRandomEventColor();

  const { data: authUsers } = useQuery({
    queryKey: ["auth-users"],
    queryFn: () =>
      fetchAllAccounts(
        query(
          accountsCollection,
          where("role", "in", [Role.Advisor, Role.Chairman]),
        ),
      ),
    staleTime: 30 * 60 * 1000,
  });
  const authUsersNames = formatAuthRoleFirstNames(authUsers);

  const {
    mutate: mutateLogout,
    isPending: isPendingLogout,
    isError: isErrorLogout,
  } = useMutation({
    mutationFn: async () => signOut(auth),
  });

  const {
    mutate: mutateDelete,
    isPending: isPendingDelete,
    isError: isErrorDelete,
    error: errorDelete,
  } = useMutation({
    mutationFn: async (password: string) => {
      await deleteUserAccount(user!, password);
    },
  });

  const handleLogout = () => {
    if (confirm("Weet je zeker dat je wilt uitloggen?")) {
      mutateLogout();
    }
  };

  const handleDeleteAccount = () => {
    const password = prompt(
      "Weet je zeker dat je je account wilt verwijderen? Dit kan niet ongedaan gemaakt worden. \nHiervoor hebben we je wachtwoord nodig.",
    );
    if (password != null) {
      mutateDelete(password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div
        className={`absolute top-0 left-0 w-full h-[40vh] ${randomEventColor}`}
      ></div>
      <div className="flex flex-col gap-4 w-full max-w-3xl -mt-45 relative z-10">
        <div className="bg-white p-6 rounded-3xl flex flex-col gap-6 items-center">
          <h1 className="text-center">Verificatie</h1>
          {isErrorLogout && (
            <Alert type="danger" size="small">
              Er is iets misgegaan tijdens het uitloggen, probeer het later nog
              eens
            </Alert>
          )}
          {isErrorDelete && (
            <Alert type="danger" size="small">
              {errorDelete?.message ??
                "Er is iets misgegaan tijdens het verwijderen, probeer het later nog eens"}
            </Alert>
          )}
          <Lottie animationData={waiting} className="w-80" loop />
          <p
            dangerouslySetInnerHTML={{
              __html:
                approval === Approval.Unknown
                  ? `Je toelating is nog in verwerking, neem contact op met ${authUsersNames} om dit proces te versnellen.`
                  : `Je toelating is helaas <span class='text-error font-bold'>afgewezen</span>. Verwijder je account of neem contact op met ${authUsersNames} voor meer informatie.`,
            }}
          />
          <div className="flex flex-col gap-1 w-full">
            <Button
              onClick={handleLogout}
              isPending={isPendingLogout}
              disabled={!user || approval === Approval.Declined}
            >
              Uitloggen
            </Button>
            <Button
              className="bg-error!"
              onClick={handleDeleteAccount}
              isPending={isPendingDelete}
              disabled={!user}
            >
              Account verwijderen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


const formatAuthRoleFirstNames = (
  accounts?: Array<{ firstName: string }>,
): string => {
  if (!accounts || accounts.length === 0) {
    return "";
  }

  const names = accounts
    .map((account) => account.firstName?.trim())
    .filter((name): name is string => Boolean(name));

  if (names.length <= 1) {
    return names[0] ?? "";
  }

  if (names.length === 2) {
    return `${names[0]} & ${names[1]}`;
  }

  return `${names.slice(0, -1).join(", ")} of ${names[names.length - 1]}`;
};