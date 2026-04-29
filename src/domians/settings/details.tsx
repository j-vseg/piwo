"use client";

import { BaseDetailScreen } from "@/components/BaseDetailScreen/BaseDetailScreen";
import { Alert } from "@/components/Alert";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAuth } from "@/contexts/auth";
import { updateAccountProfile, getAccount } from "@/services/firebase/accounts";
import { updateUserEmail, updateUserPassword } from "@/services/firebase/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { skipToken } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import Accordion from "@/components/Accordion";
import { useEffect } from "react";

type NameFormData = {
  firstname: string;
  lastname: string;
};

type EmailFormData = {
  email: string;
};

type PasswordFormData = {
  newPassword: string;
};

export default function PersonalDetailsScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: account } = useQuery({
    queryKey: ["account", user?.uid],
    queryFn: user ? () => getAccount(user.uid) : skipToken,
    staleTime: 30 * 60 * 1000,
  });

  const nameForm = useForm<NameFormData>({
    defaultValues: {
      firstname: account?.firstName ?? "",
      lastname: account?.lastName ?? "",
    },
  });
  const emailForm = useForm<EmailFormData>({
    defaultValues: { email: user?.email ?? "" },
  });
  const passwordForm = useForm<PasswordFormData>({
    defaultValues: {
      newPassword: "",
    },
  });

  const updateName = useMutation({
    mutationFn: async (data: NameFormData) => {
      if (!user) throw new Error("Niet ingelogd");
      await updateAccountProfile(user.uid, {
        firstName: data.firstname,
        lastName: data.lastname,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", user?.uid] });
      queryClient.invalidateQueries({ queryKey: ["occurrenceAvailability"] });
    },
  });
  const updateEmail = useMutation({
    mutationFn: async (data: {
      data: EmailFormData;
      currentPassword: string;
    }) => {
      if (!user) throw new Error("Niet ingelogd");
      await updateUserEmail(user, data.currentPassword, data.data.email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", user?.uid] });
    },
  });
  const updatePassword = useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      if (!user) throw new Error("Niet ingelogd");
      await updateUserPassword(user, data.currentPassword, data.newPassword);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", user?.uid] });
      passwordForm.reset({ newPassword: "" });
    },
  });
  const handleUpdatePassword = (data: PasswordFormData) => {
    const currentPassword = prompt(
      "Vul je huidige wachtwoord in om je wachtwoord te wijzigen",
    );
    if (currentPassword != null && currentPassword !== "") {
      updatePassword.mutate({ currentPassword, newPassword: data.newPassword });
    }
  };
  const handleUpdateEmail = (data: EmailFormData) => {
    const currentPassword = prompt(
      "Vul je huidige wachtwoord in om je e-mailadres te wijzigen",
    );
    if (currentPassword != null && currentPassword !== "") {
      updateEmail.mutate({ data: { email: data.email }, currentPassword });
    }
  };

  useEffect(() => {
    nameForm.reset({
      firstname: account?.firstName ?? "",
      lastname: account?.lastName ?? "",
    });
    emailForm.reset({ email: user?.email ?? "" });
    passwordForm.reset({ newPassword: "" });
  }, [account, emailForm, nameForm, passwordForm, user?.email]);


  return (
    <BaseDetailScreen
      heightClass="h-27"
      title="Persoonlijke gegevens"
      color="bg-pastelPurple"
    >
      <div className="flex flex-col w-full max-w-3xl mx-auto gap-4">
        <div className="rounded-lg overflow-hidden">
          <Accordion label="Voor- & achternaam">
            {updateName.isSuccess && (
              <Alert type="success" size="small">
                Je gegevens zijn bijgewerkt.
              </Alert>
            )}
            {updateName.isError && (
              <Alert type="danger" size="small">
                {updateName.error?.message ??
                  "Er is iets misgegaan bij het opslaan, probeer het later nog eens"}
              </Alert>
            )}
            <form
              onSubmit={nameForm.handleSubmit((data) =>
                updateName.mutate(data),
              )}
              className="flex flex-col gap-4"
            >
              <Controller
                name="firstname"
                control={nameForm.control}
                rules={{ required: "Voornaam is verplicht" }}
                render={({
                  field: { value, onChange },
                  fieldState: { error: fieldError },
                }) => (
                  <Input
                    id="firstname"
                    label="Voornaam"
                    type="text"
                    error={fieldError?.message}
                    placeholder="Jouw voornaam"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                name="lastname"
                control={nameForm.control}
                rules={{ required: "Achternaam is verplicht" }}
                render={({
                  field: { value, onChange },
                  fieldState: { error: fieldError },
                }) => (
                  <Input
                    id="lastname"
                    label="Achternaam"
                    type="text"
                    error={fieldError?.message}
                    placeholder="Jouw achternaam"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <Button
                type="submit"
                isPending={updateName.isPending}
                disabled={!nameForm.formState.isDirty}
              >
                Opslaan
              </Button>
            </form>
          </Accordion>

          <Accordion label="E-mailadres">
            {updateEmail.isSuccess && (
              <Alert type="success" size="small">
                Je e-mailadres is bijgewerkt.
              </Alert>
            )}
            {updateEmail.isError && (
              <Alert type="danger" size="small">
                {updateEmail.error?.message ??
                  "Er is iets misgegaan bij het opslaan, probeer het later nog eens"}
              </Alert>
            )}
            <form
              onSubmit={emailForm.handleSubmit(handleUpdateEmail)}
              className="flex flex-col gap-4"
            >
              <Controller
                name="email"
                control={emailForm.control}
                rules={{
                  required: "E-mailadres is verplicht",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Voer een geldig e-mailadres in",
                  },
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error: fieldError },
                }) => (
                  <Input
                    id="email"
                    label="E-mailadres"
                    type="email"
                    error={fieldError?.message}
                    placeholder="jouw@email.com"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <Button
                type="submit"
                isPending={updateEmail.isPending}
                disabled={!emailForm.formState.isDirty}
              >
                Opslaan
              </Button>
            </form>
          </Accordion>

          <Accordion label="Wachtwoord">
            {updatePassword.isSuccess && (
              <Alert type="success" size="small">
                Je wachtwoord is bijgewerkt.
              </Alert>
            )}
            {updatePassword.isError && (
              <Alert type="danger" size="small">
                {updatePassword.error?.message ??
                  "Er is iets misgegaan bij het opslaan, probeer het later nog eens"}
              </Alert>
            )}
            <form
              onSubmit={passwordForm.handleSubmit(handleUpdatePassword)}
              className="flex flex-col gap-4"
            >
              <Controller
                name="newPassword"
                control={passwordForm.control}
                rules={{
                  required: "Nieuw wachtwoord is verplicht",
                  minLength: {
                    value: 8,
                    message: "Wachtwoord moet minimaal 8 tekens zijn",
                  },
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error: fieldError },
                }) => (
                  <Input
                    id="newPassword"
                    label="Nieuw wachtwoord"
                    type="password"
                    error={fieldError?.message}
                    placeholder="Nieuw wachtwoord"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <Button
                type="submit"
                isPending={updatePassword.isPending}
                disabled={!passwordForm.formState.isDirty}
              >
                Opslaan
              </Button>
            </form>
          </Accordion>
        </div>
      </div>
    </BaseDetailScreen>
  );
}
