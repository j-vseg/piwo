"use client";

import { useAuth } from "@/contexts/auth";
import { fetchAllAccountNotApprovedUsers } from "@/services/firebase/accounts";
import { Role } from "@/types/role";
import { skipToken, useQuery } from "@tanstack/react-query";
import ApprovalOverview from "./components/ApprovalOverview";

export default function ManageScreen() {
  const { user, role } = useAuth();
  const { data, isError } = useQuery({
    queryKey: ["not-approved-users"],
    queryFn:
      user && (role === Role.Advisor || role === Role.Chairman)
        ? () => fetchAllAccountNotApprovedUsers()
        : skipToken,
    staleTime: 30 * 60 * 1000,
  });

  return (
    <div className="flex flex-col flex-1 gap-4 w-full">
      <div className="w-full bg-pastelGreen">
        <div className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-10 mb-6">
          <h1 className="text-3xl font-bold">Beheren</h1>
          <ApprovalOverview data={data ?? []} />
        </div>
      </div>
    </div>
  );
}
