import { FirebaseError } from "firebase/app";

export const getFirebaseErrorMessage = (
  error: FirebaseError,
  defaultMessage: string,
): string => {
  const errorCode = error.code;

  switch (errorCode) {
    // Authentication errors
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Ongeldig e-mailadres of wachtwoord";
    case "auth/invalid-email":
      return "Ongeldig e-mailadres";
    case "auth/user-disabled":
      return "Dit account is uitgeschakeld";
    case "auth/too-many-requests":
      return "Te veel inlogpogingen. Probeer het later opnieuw";
    case "auth/network-request-failed":
      return "Netwerkfout. Controleer je internetverbinding";
    case "auth/email-already-in-use":
      return "Dit e-mailadres is al in gebruik";
    case "auth/weak-password":
      return "Het wachtwoord is te zwak";
    case "auth/operation-not-allowed":
      return "Deze bewerking is niet toegestaan";

    // Re-authentication specific errors
    case "auth/user-mismatch":
      return "De inloggegevens komen niet overeen met de huidige gebruiker";
    case "auth/user-token-expired":
      return "Je sessie is verlopen. Log opnieuw in";
    case "auth/requires-recent-login":
      return "Deze actie vereist een recente inlogpoging. Log opnieuw in";

    // Account deletion specific errors
    case "auth/admin-restricted-operation":
      return "Deze bewerking is beperkt door de beheerder";
    case "auth/credential-already-in-use":
      return "Deze inloggegevens zijn al gekoppeld aan een ander account";
    case "auth/email-change-needs-verification":
      return "E-mailwijziging vereist verificatie";
    case "auth/internal-error":
      return "Er is een interne fout opgetreden. Probeer het later opnieuw";

    // Firestore errors
    case "permission-denied":
      return "Je hebt geen toestemming voor deze actie";
    case "not-found":
      return "Het gevraagde document werd niet gevonden";
    case "already-exists":
      return "Het document bestaat al";
    case "resource-exhausted":
      return "Te veel verzoeken. Probeer het later opnieuw";
    case "failed-precondition":
      return "Kan de actie niet uitvoeren door een foutieve status";
    case "aborted":
      return "De bewerking werd afgebroken";
    case "out-of-range":
      return "Ongeldige waarde opgegeven";
    case "unimplemented":
      return "Deze functie is niet beschikbaar";
    case "unauthenticated":
      return "Je moet ingelogd zijn om deze actie uit te voeren";

    default:
      return defaultMessage;
  }
};
