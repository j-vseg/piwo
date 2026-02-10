import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { Status } from "@/types/status";
import { db } from "./firebase";

/**
 * Get a user's availability for a specific occurrence.
 * Returns the status or null if no availability is set.
 */
export async function getUserAvailability(
  occurrenceId: string,
  userId: string,
): Promise<Status | null> {
  const availabilityRef = doc(
    db,
    `eventOccurrences/${occurrenceId}/availability/${userId}`,
  );

  const docSnap = await getDoc(availabilityRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.availability as Status;
  }

  return null;
}

/**
 * Set or update a user's availability for a specific occurrence.
 * If `status` is undefined, the user's availability is removed.
 */
export async function setUserAvailability(
  occurrenceId: string,
  userId: string,
  status?: Status,
) {
  const availabilityRef = doc(
    db,
    `eventOccurrences/${occurrenceId}/availability/${userId}`,
  );

  if (status === undefined) {
    await deleteDoc(availabilityRef);
  } else {
    // Set or update availability
    await setDoc(
      availabilityRef,
      {
        availability: status,
      },
      { merge: true },
    );
  }
}