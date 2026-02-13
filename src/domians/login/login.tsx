"use client";

import { Alert } from "@/components/Alert";
import { BaseDetailScreen } from "@/components/BaseDetailScreen/BaseDetailScreen";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { auth } from "@/services/firebase/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const { replace } = useRouter();
  const methods = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const queryClient = useQueryClient();
  const { mutate, isSuccess, isPending, isError } = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      return userCredential.user;
    },
    onSuccess: () => {
      queryClient.clear();
      setTimeout(() => replace("/"), 3000);
    },
  });

  return (
    <BaseDetailScreen heightClass="h-50" color="bg-pastelPurple">
      <div className="flex flex-col w-full max-w-3xl mx-auto gap-4">
        <div className="bg-white p-6 rounded-3xl flex flex-col gap-6">
          <h1>Inloggen</h1>
          {isSuccess && (
            <Alert type="success" size="small">
              Login successvol!{" "}
              <span className="text-success font-semibold">
                Navigeren naar home pagina...
              </span>
            </Alert>
          )}
          {isError && (
            <Alert type="danger" size="small">
              Er is iets misgegaan tijdens het inloggen, probeer het later nog
              eens
            </Alert>
          )}
          <form
            onSubmit={methods.handleSubmit((data) => mutate(data))}
            className="flex flex-col gap-3"
          >
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
                  label="Wachtwoord"
                  type="password"
                  error={error?.message}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            <div className="flex flex-col gap-1">
              <Button isPending={isPending}>Inloggen</Button>
              <a
                className="text-[12px]! underline text-orange-400"
                href="/sign-up"
              >
                Nog geen account?
              </a>
            </div>
          </form>
        </div>
      </div>
    </BaseDetailScreen>
  );
}
