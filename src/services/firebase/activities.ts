import {
  DocumentData,
  Query,
  getDocs,
  DocumentReference,
} from "firebase/firestore";
import { activitiesCollection } from "./firebase";
import { Activity } from "@/types/activity";
import { Availability } from "@/types/availability";
import { Status } from "@/types/status";

export async function getActivities(query?: Query): Promise<Activity[]> {
  const querySnapshot = query
    ? await getDocs(query)
    : await getDocs(activitiesCollection);

  const activities: Activity[] = querySnapshot.docs.map((doc: DocumentData) => {
    const data = doc.data();

    const availabilities: Availability[] = Array.isArray(data.availabilities)
      ? data.availabilities.map((a: Availability) => ({
          key: a.key as DocumentReference,
          status: a.status as Status,
        }))
      : [];

    return {
      id: doc.id,
      name: data.name,
      category: data.category,
      color: data.color,
      startDate: data.startDate,
      endDate: data.endDate,
      recurrence: data.recurrence,
      availabilities,
    };
  });

  return activities;
}
