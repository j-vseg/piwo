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
import { accountsCollection, db } from "@/firebase";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
} from "firebase/auth";
import {
  getAuth as getNativeAuth,
  EmailAuthProvider as NativeEmailAuthProvider,
  reauthenticateWithCredential as nativeReauthenticate,
  deleteUser as nativeDeleteUser,
} from "@react-native-firebase/auth";
import { FirebaseError } from "firebase/app";
import { Approval } from "@/constants/Approval";
import { Platform } from "react-native";
import { OS } from "@/constants/Os";
import { Role } from "@/constants/Role";
import { getFirebaseErrorMessage } from "@/utils/getFirebaseErrorMessage";

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
    if (user.email) {
      if (Platform.OS !== OS.Web) {
        const nativeUser = getNativeAuth().currentUser;
        if (!nativeUser) throw new Error("Geen ingelogde gebruiker gevonden");
        const credential = NativeEmailAuthProvider.credential(
          user.email,
          password,
        );
        await nativeReauthenticate(nativeUser, credential);
      } else {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      }
    }

    const availabilityQuery = collectionGroup(db, "availability");
    const allAvailabilitySnapshot = await getDocs(availabilityQuery);

    const userAvailabilityDocs = allAvailabilitySnapshot.docs.filter(
      (doc) => doc.id === user.uid,
    );

    const deletePromises: Promise<void>[] = [];
    for (const availabilityDoc of userAvailabilityDocs) {
      deletePromises.push(deleteDoc(availabilityDoc.ref));
    }

    await Promise.allSettled(deletePromises);

    await deleteDoc(doc(accountsCollection, user.uid));
    if (Platform.OS !== OS.Web) {
      const nativeUser = getNativeAuth().currentUser;
      if (nativeUser) await nativeDeleteUser(nativeUser);
    } else {
      await deleteUser(user);
    }
  } catch (error) {
    console.error("Error deleting user account:", error);
    
    const customMessage = getFirebaseErrorMessage(
      error as FirebaseError,
      "Er is iets misgegaan tijdens het verwijderen van je account, probeer het later nog eens",
    );
    throw new Error(customMessage);
  }
}