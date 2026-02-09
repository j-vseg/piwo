import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { Status } from "@/types/status";
import { db } from "./firebase";

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
