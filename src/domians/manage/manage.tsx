"use client";

import { useAuth } from "@/contexts/auth";
import { fetchAllAccounts } from "@/services/firebase/accounts";
import { accountsCollection } from "@/services/firebase/firebase";
import { Approval } from "@/types/approval";
import { Role } from "@/types/role";
import { skipToken, useQuery } from "@tanstack/react-query";
import { query, where } from "firebase/firestore";
import ApprovalOverview from "./components/ApprovalOverview";
import ManagementOverview from "./components/ManagementOverview";

export default function ManageScreen() {
  const { user, role } = useAuth();
  const { data } = useQuery({
    queryKey: ["not-approved-users"],
    queryFn:
      user && (role === Role.Advisor || role === Role.Chairman)
        ? () =>
            fetchAllAccounts(
              query(
                accountsCollection,
                where("approval", "==", Approval.Unknown),
              ),
            )
        : skipToken,
    staleTime: 30 * 60 * 1000,
  });

  return (
    <div className="flex flex-col flex-1 gap-4 w-full">
      <div className="w-full bg-pastelGreen">
        <div className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-10 mb-6">
          <h1 className="text-3xl font-bold">Beheren</h1>
          {data && data.length > 0 ? (
            <ApprovalOverview data={data} />
          ) : (
            <ManagementOverview />
          )}
        </div>
      </div>
    </div>
  );
}
