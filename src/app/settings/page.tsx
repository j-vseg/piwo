"use client";

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/services/firebase/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import { SubmitHandler, useForm } from "react-hook-form";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function SettingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginFormInputs) => {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return userCredential.user;
    },
    onSuccess: (user) => {
      console.log("Logged in as:", user.email);
      queryClient.clear();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await signOut(auth);
    },
    onSuccess: () => {
      console.log("Logged out");
      queryClient.clear();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      {user ? (
        <div>
          <p className="mb-4">Logged in as: {user.email}</p>
          <button
            onClick={() => logoutMutation.mutate()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="border p-2 rounded w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="border p-2 rounded w-full"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>
      )}
    </div>
  );
}
