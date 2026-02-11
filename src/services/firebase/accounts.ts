import { getDocs } from "firebase/firestore";
import { accountsCollection } from "./firebase";

export async function getAllAccountsDisplayNames(): Promise<
  Record<string, string>
> {
  const usersSnapshot = await getDocs(accountsCollection);

  const displayNames: Record<string, string> = {};

  usersSnapshot.forEach((doc) => {
    const accountData = doc.data();
    const firstName = accountData.firstName || "";
    const lastName = accountData.lastName || "";
    const displayName = `${firstName} ${lastName}`.trim();

    displayNames[doc.id] = displayName;
  });

  return displayNames;
}
