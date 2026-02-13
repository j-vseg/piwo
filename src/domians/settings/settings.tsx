"use client";

import { useMutation } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase/firebase";
import { Alert } from "@/components/Alert";
import { useAuth } from "@/contexts/auth";
import ListTile from "@/components/ListTile";
import { useRouter } from "next/navigation";

export default function SettingsScreen() {
  const { user } = useAuth();
  const { replace } = useRouter();

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
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div
        className={`absolute top-0 left-0 w-full h-[15vh] bg-pastelOrange`}
      ></div>
      <div className="flex flex-col gap-4 w-full max-w-3xl -mt-155 relative z-10">
        <h1 className="text-center">Instellingen</h1>
        {isErrorLogout && (
          <Alert type="danger" size="small">
            Er is iets misgegaan tijdens het uitloggen, probeer het later nog
            eens
          </Alert>
        )}
        <div className="rounded-lg overflow-hidden">
          <ListTile onClick={handleLogout} disabled={!user || isPendingLogout}>
            Uitloggen
          </ListTile>
        </div>
      </div>
    </div>
  );
}
