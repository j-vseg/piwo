"use client";

import { useMutation } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase/firebase";
import { Alert } from "@/components/Alert";
import { useAuth } from "@/contexts/auth";
import ListTile from "@/components/ListTile";
import { useRouter } from "next/navigation";
import { deleteUserAccount } from "@/services/firebase/accounts";
import { BaseDetailScreen } from "@/components/BaseDetailScreen/BaseDetailScreen";

export default function SettingsScreen() {
  const { user } = useAuth();
  const { replace } = useRouter();

  const {
    mutate: mutateDelete,
    isPending: isPendingDelete,
    isError: isErrorDelete,
  } = useMutation({
    mutationFn: async (password: string | null) => {
      if (!password) {
        throw Error;
      }
      deleteUserAccount(user!, password);
    },
    onSuccess: () => {
      replace("/"); // Redirect to home after logout
    },
  });

  const handleDeleteAccount = () => {
    const password = prompt(
      "Weet je zeker dat je je account wilt verwijderen? Dit kan niet ongedaan gemaakt worden. \nHiervoor hebben we je wachtwoord nodig.",
    );
    if (password != null) {
      mutateDelete(password);
    }
  };

  const {
    mutate: mutateLogout,
    isPending: isPendingLogout,
    isError: isErrorLogout,
  } = useMutation({
    mutationFn: async () => signOut(auth),
    onSuccess: () => {
      replace("/"); // Redirect to home after logout
    },
  });

  const handleLogout = () => {
    if (confirm("Weet je zeker dat je wilt uitloggen?")) {
      mutateLogout();
    }
  };

  return (
    <BaseDetailScreen heightClass="h-27" title="Instellingen">
      <div className="flex flex-col p-4 -mt-8">
        {isErrorLogout && (
          <Alert type="danger" size="small">
            Er is iets misgegaan tijdens het uitloggen, probeer het later nog
            eens
          </Alert>
        )}
        {isErrorDelete && (
          <Alert type="danger" size="small">
            Er is iets misgegaan tijdens het verwijderen, probeer het later nog
            eens
          </Alert>
        )}
        <div className="flex flex-col gap-2">
          <h3 className="ml-2">Account</h3>
          <div className="rounded-lg overflow-hidden">
            <ListTile
              onClick={handleLogout}
              disabled={!user || isPendingLogout}
            >
              Uitloggen
            </ListTile>
            <ListTile
              onClick={handleDeleteAccount}
              disabled={!user || isPendingDelete}
              className="text-error!"
            >
              Verwijder account
            </ListTile>
          </div>
        </div>
      </div>
    </BaseDetailScreen>
  );
}
