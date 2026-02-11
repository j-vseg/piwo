import { doc, setDoc, deleteDoc, getDoc, getDocs, collection } from "firebase/firestore";
import { Status } from "@/types/status";
import { db } from "./firebase";
import { EventOccurrence } from "@/types/eventOccurence";

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

/**
 * Check if a user has **not entered availability** for any of the given occurrences.
 * Returns true if at least one occurrence is missing availability.
 */
export async function isUserMissingAvailability(
  userId: string,
  occurrences: EventOccurrence[],
): Promise<boolean> {
  for (const occ of occurrences) {
    const availabilityRef = doc(
      db,
      `eventOccurrences/${occ.id}/availability/${userId}`,
    );

    const docSnap = await getDoc(availabilityRef);
    if (!docSnap.exists()) {
      return true; // found at least one occurrence without availability
    }
  }

  return false; // user has availability for all occurrences
}

export async function getOccurrenceAvailability(
  occurrenceId: string
): Promise<Record<Status, string[]> | null> {
  const availabilitySnapshot = await getDocs(
    collection(db, `eventOccurrences/${occurrenceId}/availability`)
  );

  if (availabilitySnapshot.empty) {
    return null;
  }

  const groupedByStatus: Record<Status, string[]> = {} as Record<Status, string[]>;
  
  availabilitySnapshot.forEach((doc) => {
    const status = doc.data().availability as Status;
    const userId = doc.id;
    
    if (!groupedByStatus[status]) {
      groupedByStatus[status] = [];
    }
    groupedByStatus[status].push(userId);
  });

  return groupedByStatus;
}