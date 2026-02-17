"use client";

import Lottie from "lottie-react";
import waiting from "@/../assets/waiting.json";
import Button from "@/components/Button";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase/firebase";
import { Alert } from "@/components/Alert";
import { deleteUserAccount } from "@/services/firebase/accounts";
import { useAuth } from "@/contexts/auth";
import { getRandomEventColor } from "@/utils/getRandomEventColor";

export default function VerificationScreen() {
  const { user } = useAuth();
  const eventColor = getRandomEventColor();

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
  } = useMutation({
    mutationFn: async (password: string | null) => {
      if (!password) {
        throw Error;
      }
      deleteUserAccount(user!, password);
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
        className={`absolute top-0 left-0 w-full h-[40vh] ${eventColor}`}
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
              Er is iets misgegaan tijdens het verwijderen, probeer het later
              nog eens
            </Alert>
          )}
          <Lottie animationData={waiting} className="w-80" loop />
          <p>Je toelating is nog in verwerking, dit kan even duren...</p>
          <div className="flex flex-col gap-1 w-full">
            <Button onClick={handleLogout} isPending={isPendingLogout}>
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
