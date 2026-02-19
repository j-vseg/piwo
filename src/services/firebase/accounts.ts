import {
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
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
    isApproved: false,
  });
}

export async function getAccount(userId: string): Promise<{
  isApproved: boolean;
} | null> {
  const docSnap = await getDoc(doc(accountsCollection, userId));

  if (docSnap.exists()) {
    return docSnap.data() as {
      isApproved: boolean;
    };
  }

  return null;
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