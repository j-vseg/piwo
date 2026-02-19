"use client";

import { Alert } from "@/components/Alert";
import { BaseDetailScreen } from "@/components/BaseDetailScreen/BaseDetailScreen";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { createAuthUser, createFirestoreUser } from "@/services/firebase/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

type SignUpFormData = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};


export default function SignUpScreen() {
  const { replace } = useRouter();
  const methods = useForm<SignUpFormData>({
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
    error: errorCreateAuth,
  } = useMutation({
    mutationFn: (data: SignUpFormData) =>
      createAuthUser(data.email, data.password),
    onSuccess: ({ user, data }) => {
      mutateCreateFirestore({ user, data });
    },
  });

  const {
    mutate: mutateCreateFirestore,
    isSuccess: isSuccessCreateFirestore,
    isPending: isPendingCreateFirestore,
    isError: isErrorCreateFirestore,
    error: errorCreateFirestore,
  } = useMutation({
    mutationFn: (data: {
      user: User;
      data: { email: string; password: string };
    }) => createFirestoreUser(data.user, data.data.email, data.data.password),
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
          {(isErrorCreateAuth || isErrorCreateFirestore) && (
            <Alert type="danger" size="small">
              {errorCreateAuth?.message ??
                errorCreateFirestore?.message ??
                "Er is een onbekende fout opgetreden"}
            </Alert>
          )}
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
