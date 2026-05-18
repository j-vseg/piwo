import {
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  type DocumentData,
  type Query,
} from "firebase/firestore";
import { accountsCollection, db } from "./firebase";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
} from "firebase/auth";
import { getFirebaseErrorMessage } from "@/utils/getFirebaseErrorMessage";
import { FirebaseError } from "firebase/app";
import { Role } from "@/types/role";
import { Approval } from "@/types/approval";

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

export async function createUser(
  userId: string,
  firstname: string,
  lastname: string,
): Promise<void> {
  await setDoc(doc(accountsCollection, userId), {
    firstName: firstname,
    lastName: lastname,
    approval: Approval.Unknown,
    role: Role.Lid,
  });
}

export async function getAccount(userId: string): Promise<{
  approval: Approval;
  firstName: string;
  lastName: string;
  role: Role;
} | null> {
  const docSnap = await getDoc(doc(accountsCollection, userId));

  if (docSnap.exists()) {
    return docSnap.data() as {
      approval: Approval;
      firstName: string;
      lastName: string;
      role: Role;
    };
  }

  return null;
}

export async function updateAccountRole(
  userId: string,
  role: Role,
): Promise<void> {
  try {
    await updateDoc(doc(accountsCollection, userId), {
      role: role,
    });
  } catch (error) {
    const customMessage = getFirebaseErrorMessage(
      error as FirebaseError,
      "Er is iets misgegaan bij het bijwerken van de rol, probeer het later nog eens",
    );
    throw new Error(customMessage);
  }
}

export async function updateAccountApproval(
  userId: string,
  approval: Approval,
): Promise<void> {
  try {
    await updateDoc(doc(accountsCollection, userId), {
      approval: approval,
    });
  } catch (error) {
    const customMessage = getFirebaseErrorMessage(
      error as FirebaseError,
      "Er is iets misgegaan bij het bijwerken van de goedkeuring, probeer het later nog eens",
    );
    throw new Error(customMessage);
  }
}

export async function updateAccountProfile(
  userId: string,
  data: { firstName: string; lastName: string },
): Promise<void> {
  try {
    await updateDoc(doc(accountsCollection, userId), {
      firstName: data.firstName,
      lastName: data.lastName,
    });
  } catch (error) {
    const customMessage = getFirebaseErrorMessage(
      error as FirebaseError,
      "Er is iets misgegaan bij het bijwerken van je gegevens, probeer het later nog eens",
    );
    throw new Error(customMessage);
  }
}

export async function fetchAllAccounts(
  accountsQuery?: Query<DocumentData>,
): Promise<
  {
    id: string;
    firstName: string;
    lastName: string;
    approval: Approval;
    role: Role;
  }[]
> {
  const usersSnapshot = await getDocs(accountsQuery ?? accountsCollection);

  const accounts = usersSnapshot.docs.map((accountDoc) => {
    const data = accountDoc.data();

    return {
      id: accountDoc.id,
      firstName: data.firstName,
      lastName: data.lastName,
      approval: data.approval,
      role: data.role,
    };
  });

  return accounts.sort((a, b) =>
    a.firstName.localeCompare(b.firstName, "nl", { sensitivity: "base" }),
  );
}

export async function deleteUserAccount(
  user: User,
  password: string,
): Promise<void> {
  try {
    // Re-authenticate user first
    if (user.email) {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
    }

    // Query all availability documents across all occurrences
    const availabilityQuery = collectionGroup(db, "availability");
    const allAvailabilitySnapshot = await getDocs(availabilityQuery);

    // Filter for documents where the document ID matches the user ID
    const userAvailabilityDocs = allAvailabilitySnapshot.docs.filter(
      (doc) => doc.id === user.uid,
    );

    // Delete all availability documents for this user
    const deletePromises: Promise<void>[] = [];
    for (const availabilityDoc of userAvailabilityDocs) {
      deletePromises.push(deleteDoc(availabilityDoc.ref));
    }

    await Promise.allSettled(deletePromises);
    console.log("All availability documents deleted");

    await deleteDoc(doc(accountsCollection, user.uid));
    await deleteUser(user);
    console.log("Deleted user account");
  } catch (error) {
    console.error("Error deleting user account:", error);
    
    const customMessage = getFirebaseErrorMessage(
      error as FirebaseError,
      "Er is iets misgegaan tijdens het verwijderen van je account, probeer het later nog eens",
    );
    throw new Error(customMessage);
  }
}