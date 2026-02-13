import {
  collection,
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

    // First, get all event occurrences
    const occurrencesSnapshot = await getDocs(
      collection(db, "eventOccurrences"),
    );

    // Delete availability for this user across all occurrences
    const deletePromises: Promise<void>[] = [];

    for (const occurrenceDoc of occurrencesSnapshot.docs) {
      const availabilityDocRef = doc(
        db,
        `eventOccurrences/${occurrenceDoc.id}/availability/${user.uid}`,
      );
      deletePromises.push(deleteDoc(availabilityDocRef));
    }

    await Promise.allSettled(deletePromises);
    await deleteDoc(doc(accountsCollection, user.uid));
    await deleteUser(user);
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw error;
  }
}
