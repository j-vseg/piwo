import { doc, setDoc } from "firebase/firestore";
import { Status } from "@/types/status";
import { db } from "./firebase";

/**
 * Set or update a user's availability for a specific occurrence.
 */
export async function setUserAvailability(
  occurrenceId: string,
  userId: string,
  status: Status,
) {
  console.log("occurrenceId", occurrenceId);
  const availabilityRef = doc(
    db,
    `eventOccurrences/${occurrenceId}/availability/${userId}`,
  );

  await setDoc(
    availabilityRef,
    {
      availability: status,
    },
    { merge: true },
  );
}
