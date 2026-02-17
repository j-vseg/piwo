"use client";

import { Alert } from "@/components/Alert";
import { BaseDetailScreen } from "@/components/BaseDetailScreen/BaseDetailScreen";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { createUser } from "@/services/firebase/accounts";
import { auth } from "@/services/firebase/firebase";
import { getFirebaseErrorMessage } from "@/utils/getFirebaseErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

type LoginFormValues = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export default function SignUpScreen() {
  const { replace } = useRouter();
  const methods = useForm<LoginFormValues>({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
  });
  const queryClient = useQueryClient();
  const {
    mutate: mutateCreateAuth,
    isPending: isPendingCreateAuth,
    isError: isErrorCreateAuth,
    error,
  } = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password,
        );
        return { user: userCredential.user, data: data };
      } catch (error) {
        const customMessage = getFirebaseErrorMessage(
          error as FirebaseError,
          "Er is iets misgegaan tijdens het aanmaken van je account, probeer het later nog eens",
        );
        throw new Error(customMessage);
      }
    },
    onSuccess: ({ user, data }) => {
      mutateCreateFirestore({ user, data });
    },
  });

  const {
    mutate: mutateCreateFirestore,
    isSuccess: isSuccessCreateFirestore,
    isPending: isPendingCreateFirestore,
    isError: isErrorCreateFirestore,
  } = useMutation({
    mutationFn: async ({
      user,
      data,
    }: {
      user: User;
      data: LoginFormValues;
    }) => {
      await createUser(user.uid, data.firstname, data.lastname);
    },
    onSuccess: () => {
      queryClient.clear();
      setTimeout(() => replace("/"), 3000);
    },
  });

  return (
    <BaseDetailScreen heightClass="h-55" color="bg-pastelBlue">
      <div className="flex flex-col w-full max-w-3xl mx-auto gap-4">
        <div className="bg-white p-6 rounded-3xl flex flex-col gap-6">
          <h1>Creër een account</h1>
          {isSuccessCreateFirestore && (
            <Alert type="success" size="small">
              Creëren van account successvol!{" "}
              <span className="text-success font-semibold">
                Navigeren naar home pagina...
              </span>
            </Alert>
          )}
          {isErrorCreateAuth ||
            (isErrorCreateFirestore && (
              <Alert type="danger" size="small">
                {error?.message ?? "Er is een onbekende fout opgetreden"}
              </Alert>
            ))}
          <form
            onSubmit={methods.handleSubmit((data) => mutateCreateAuth(data))}
            className="flex flex-col gap-3"
          >
            <Controller
              name="firstname"
              control={methods.control}
              rules={{
                required: "Voornaam kan niet leeg zijn",
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Input
                  id="firstname"
                  label="Voornaam"
                  type="text"
                  error={error?.message}
                  placeholder="Jouw voornaam"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            <Controller
              name="lastname"
              control={methods.control}
              rules={{
                required: "Achternaam kan niet leeg zijn",
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Input
                  id="lastname"
                  label="Achternaam"
                  type="text"
                  error={error?.message}
                  placeholder="Jouw achternaam"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            <Controller
              name="email"
              control={methods.control}
              rules={{
                required: "Email kan niet leeg zijn",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Voer een geldig e-mailadres in",
                },
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  error={error?.message}
                  placeholder="jouw@email.com"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            <Controller
              name="password"
              control={methods.control}
              rules={{
                required: "Wachtwoord kan niet leeg zijn",
                minLength: {
                  value: 8,
                  message: "Wachtwoord moet minimaal 8 characters lang zijn",
                },
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Input
                  id="password"
                  label="Wachtwoord"
                  type="password"
                  error={error?.message}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            <Button isPending={isPendingCreateAuth || isPendingCreateFirestore}>
              Creër je account
            </Button>
          </form>
        </div>
      </div>
    </BaseDetailScreen>
  );
}
