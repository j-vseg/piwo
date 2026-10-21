import { auth } from "@/config/firebase";
import { OS } from "@/constants/Os";
import { createUser } from "@/services/firebase/accounts";
import { getFirebaseErrorMessage } from "@/utils/getFirebaseErrorMessage";
import {
    getAuth as getNativeAuth,
    createUserWithEmailAndPassword as nativeCreateUser,
    EmailAuthProvider as NativeEmailAuthProvider,
    reauthenticateWithCredential as nativeReauthenticate,
    signInWithEmailAndPassword as nativeSignIn,
    updateEmail as nativeUpdateEmail,
    updatePassword as nativeUpdatePassword,
    onAuthStateChanged as onNativeAuthStateChanged,
} from "@react-native-firebase/auth";
import { FirebaseError } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    onAuthStateChanged as onWebAuthStateChanged,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    updateEmail,
    updatePassword,
    User,
    signOut as webSignOut,
} from "firebase/auth";
import { Platform } from "react-native";

export function onAuthStateChanged(callback: (user: unknown) => void) {
  if (Platform.OS === OS.Web) {
    return onWebAuthStateChanged(auth, callback);
  }
  return onNativeAuthStateChanged(getNativeAuth(), callback);
}

export function getCurrentUser() {
  if (Platform.OS === OS.Web) {
    return auth.currentUser;
  }
  return getNativeAuth().currentUser;
}

export async function signOut(): Promise<void> {
  if (Platform.OS !== OS.Web) {
    await getNativeAuth().signOut();
  } else {
    await webSignOut(auth);
  }
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<User> {
  try {
    if (Platform.OS !== OS.Web) {
      const cred = await nativeSignIn(getNativeAuth(), email, password);
      return cred.user as unknown as User;
    }
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error) {
    const customMessage = getFirebaseErrorMessage(
      error as FirebaseError,
      "Er is iets misgegaan tijdens het inloggen, probeer het later nog eens",
    );
    throw new Error(customMessage);
  }
}

export async function createAuthUser(
  email: string,
  password: string,
): Promise<{ user: User; data: { email: string; password: string } }> {
  try {
    if (Platform.OS !== OS.Web) {
      const cred = await nativeCreateUser(getNativeAuth(), email, password);
      return { user: cred.user as unknown as User, data: { email, password } };
    }
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return { user: userCredential.user, data: { email, password } };
  } catch (error) {
    const customMessage = getFirebaseErrorMessage(
      error as FirebaseError,
      "Er is iets misgegaan tijdens het aanmaken van je account, probeer het later nog eens",
    );
    throw new Error(customMessage);
  }
}

export async function createFirestoreUser(
  user: User,
  firstname: string,
  lastname: string,
): Promise<void> {
  try {
    await createUser(user.uid, firstname, lastname);
  } catch (error) {
    const customMessage = getFirebaseErrorMessage(
      error as FirebaseError,
      "Er is iets misgegaan bij het opslaan van je gegevens, probeer het later nog eens",
    );
    throw new Error(customMessage);
  }
}

async function reauthenticate(
  user: User,
  currentPassword: string,
): Promise<void> {
  if (!user.email) {
    throw new Error("Geen e-mailadres gekoppeld aan dit account");
  }
  try {
    if (Platform.OS !== OS.Web) {
      const nativeUser = getNativeAuth().currentUser;
      if (!nativeUser) throw new Error("Geen ingelogde gebruiker gevonden");
      const credential = NativeEmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await nativeReauthenticate(nativeUser, credential);
    } else {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);
    }
  } catch (error) {
    const customMessage = getFirebaseErrorMessage(
      error as FirebaseError,
      "Re-authenticatie mislukt",
    );
    throw new Error(customMessage);
  }
}

export async function updateUserEmail(
  user: User,
  currentPassword: string,
  newEmail: string,
): Promise<void> {
  try {
    await reauthenticate(user, currentPassword);
    if (Platform.OS !== OS.Web) {
      const nativeUser = getNativeAuth().currentUser;
      if (!nativeUser) throw new Error("Geen ingelogde gebruiker gevonden");
      await nativeUpdateEmail(nativeUser, newEmail);
    } else {
      await updateEmail(user, newEmail);
    }
  } catch (error) {
    const customMessage = getFirebaseErrorMessage(
      error as FirebaseError,
      "Het is niet gelukt om je e-mailadres bij te werken",
    );
    throw new Error(customMessage);
  }
}

export async function updateUserPassword(
  user: User,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  try {
    await reauthenticate(user, currentPassword);
    if (Platform.OS !== OS.Web) {
      const nativeUser = getNativeAuth().currentUser;
      if (!nativeUser) throw new Error("Geen ingelogde gebruiker gevonden");
      await nativeUpdatePassword(nativeUser, newPassword);
    } else {
      await updatePassword(user, newPassword);
    }
  } catch (error) {
    const customMessage = getFirebaseErrorMessage(
      error as FirebaseError,
      "Het is niet gelukt om je wachtwoord bij te werken",
    );
    throw new Error(customMessage);
  }
}
