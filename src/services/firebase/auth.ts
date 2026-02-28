import { createUser } from "@/services/firebase/accounts";
import { auth } from "@/services/firebase/firebase";
import { getFirebaseErrorMessage } from "@/utils/getFirebaseErrorMessage";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  User,
} from "firebase/auth";

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<User> {
  try {
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
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return { user: userCredential.user, data: { email: email, password: password } };
  } catch (error) {
    const customMessage = getFirebaseErrorMessage(
      error as FirebaseError,
      "Er is iets misgegaan tijdens het aanmaken van je account, probeer het later nog eens",
    );
    throw new Error(customMessage);
  }
}

export async function createFirestoreUser(user: User, firstname: string, lastname: string): Promise<void> {
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

async function reauthenticate(user: User, currentPassword: string): Promise<void> {
  if (!user.email) {
    throw new Error("Geen e-mailadres gekoppeld aan dit account");
  }
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  try {
    await reauthenticateWithCredential(user, credential);
  } catch (error) {
    const customMessage = getFirebaseErrorMessage(
      error as FirebaseError,
      "Huidig wachtwoord is onjuist",
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
    await updateEmail(user, newEmail);
  } catch (error) {
    const customMessage = getFirebaseErrorMessage(
      error as FirebaseError,
      "Er is iets misgegaan bij het wijzigen van je e-mailadres, probeer het later nog eens",
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
    await updatePassword(user, newPassword);
  } catch (error) {
    const customMessage = getFirebaseErrorMessage(
      error as FirebaseError,
      "Er is iets misgegaan bij het wijzigen van je wachtwoord, probeer het later nog eens",
    );
    throw new Error(customMessage);
  }
}
